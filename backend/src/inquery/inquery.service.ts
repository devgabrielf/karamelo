import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInqueryDto, SendMessageDto } from './dtos';
import { ErrorMessage, InqueryStatus } from './enums';
import { AnimalStatus } from '../animal/enums';
import type { GetUserType } from '../user/types';
import { nanoid } from 'nanoid';
import { getImagePath } from '../image/utils';

@Injectable()
export class InqueryService {
  constructor(private prisma: PrismaService) {}

  async getInqueryById(inqueryId: string, userId: GetUserType['id']) {
    const inquery = await this.prisma.inquery.findUnique({
      where: {
        id: inqueryId,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        status: true,
        messages: {
          select: {
            id: true,
            content: true,
            authorId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        animal: {
          select: {
            id: true,
            name: true,
            sex: true,
            city: true,
            uf: true,
            pictures: true,
            months: true,
            species: true,
            status: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            city: true,
            uf: true,
            avatar: true,
            picture: true,
            homeImages: true,
          },
        },
      },
    });

    const isAuthor = userId === inquery?.author.id;
    const isAnimalAuthor = userId === inquery?.animal.author.id;

    if (
      !inquery ||
      !(isAuthor || isAnimalAuthor) ||
      ![InqueryStatus.APPROVED, InqueryStatus.PENDING].includes(
        inquery.status as InqueryStatus,
      )
    ) {
      throw new NotFoundException(ErrorMessage.INQUERY_NOT_FOUND);
    }

    return {
      ...inquery,
      animal: {
        ...inquery.animal,
        pictures: inquery.animal.pictures.map(({ id, fileName }) => ({
          id,
          src: getImagePath(fileName),
        })),
        author: {
          ...inquery.animal.author,
          avatar: getImagePath(inquery.animal.author.avatar),
        },
      },
      author: {
        ...inquery.author,
        avatar: getImagePath(inquery.author.avatar),
        picture: getImagePath(inquery.author.picture),
        homeImages: inquery.author.homeImages.map((image) => ({
          id: image.id,
          src: getImagePath(image.fileName),
        })),
      },
    };
  }

  async getMyInqueries(userId: GetUserType['id']) {
    const _inqueries = await this.prisma.inquery.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        status: true,
        animal: {
          select: {
            id: true,
            name: true,
            sex: true,
            city: true,
            uf: true,
            pictures: true,
            months: true,
            species: true,
            status: true,
            adoptedById: true,
            createdAt: true,
          },
        },
      },
    });

    const inqueries = _inqueries.map((inquery) => ({
      ...inquery,
      animal: {
        ...inquery.animal,
        adoptedById: undefined,
        adopter:
          inquery.status !== InqueryStatus.FINISHED
            ? undefined
            : inquery.animal.adoptedById === userId,
      },
    }));

    return inqueries;
  }

  async getInqueriesByAnimalId(animalId: string, userId: GetUserType['id']) {
    const animal = await this.prisma.animal.findUnique({
      where: {
        id: animalId,
      },
      select: {
        id: true,
        name: true,
        sex: true,
        city: true,
        uf: true,
        pictures: true,
        months: true,
        species: true,
        status: true,
        createdAt: true,
        authorId: true,
      },
    });

    if (animal.status !== AnimalStatus.APPROVED) {
      throw new NotFoundException(ErrorMessage.ANIMAL_NOT_AVAILABLE);
    }

    if (animal.authorId !== userId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const inqueries = await this.prisma.inquery.findMany({
      where: {
        animalId,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            homeImages: true,
          },
        },
      },
    });

    delete animal.authorId;

    return {
      inqueries: inqueries.map((inquery) => ({
        ...inquery,
        author: {
          ...inquery.author,
          avatar: getImagePath(inquery.author.avatar) || null,
          homeImages: inquery.author.homeImages.map((image) => ({
            id: image.id,
            src: getImagePath(image.fileName),
          })),
        },
      })),
      animal: {
        ...animal,
        pictures: animal.pictures.map(({ id, fileName }) => ({
          id,
          src: getImagePath(fileName),
        })),
      },
    };
  }

  async createInquery(
    dto: CreateInqueryDto,
    animalId: string,
    authorId: GetUserType['id'],
  ) {
    const alreadyExists = await this.prisma.inquery.findFirst({
      where: {
        authorId,
        animalId,
      },
    });

    if (alreadyExists) {
      throw new BadRequestException(ErrorMessage.INQUERY_ALREADY_EXISTS);
    }

    const animal = await this.prisma.animal.findUnique({
      where: {
        id: animalId,
      },
    });

    if (!animal) {
      throw new NotFoundException(ErrorMessage.ANIMAL_NOT_FOUND);
    }

    if (animal.authorId === authorId) {
      throw new ForbiddenException(ErrorMessage.OWN_AUTHOR);
    }

    if (animal.status !== AnimalStatus.APPROVED) {
      throw new ForbiddenException(ErrorMessage.ANIMAL_NOT_AVAILABLE);
    }

    const id = nanoid(8);

    const inquery = await this.prisma.inquery.create({
      data: {
        id,
        authorId,
        animalId,
        ...dto,
      },
    });

    return inquery;
  }

  async approveInquery(inqueryId: string, userId: GetUserType['id']) {
    const inquery = await this.prisma.inquery.findUnique({
      where: {
        id: inqueryId,
      },
      select: {
        status: true,
        animal: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!inquery) {
      throw new NotFoundException(ErrorMessage.INQUERY_NOT_FOUND);
    }

    if (inquery.animal.authorId !== userId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    if (inquery.status !== InqueryStatus.PENDING) {
      throw new BadRequestException(ErrorMessage.INQUERY_NOT_PENDING);
    }

    await this.prisma.inquery.update({
      where: {
        id: inqueryId,
      },
      data: {
        status: InqueryStatus.APPROVED,
      },
    });
  }

  async rejectInquery(inqueryId: string, userId: GetUserType['id']) {
    const inquery = await this.prisma.inquery.findUnique({
      where: {
        id: inqueryId,
      },
      select: {
        status: true,
        animal: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!inquery) {
      throw new NotFoundException(ErrorMessage.INQUERY_NOT_FOUND);
    }

    if (inquery.animal.authorId !== userId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    if (inquery.status !== InqueryStatus.PENDING) {
      throw new BadRequestException(ErrorMessage.INQUERY_NOT_PENDING);
    }

    await this.prisma.inquery.update({
      where: {
        id: inqueryId,
      },
      data: {
        status: InqueryStatus.REJECTED,
      },
    });
  }

  async getMessagesByInqueryId(inqueryId: string, authorId: GetUserType['id']) {
    const inquery = await this.prisma.inquery.findUnique({
      where: {
        id: inqueryId,
      },
      select: {
        status: true,
        authorId: true,
        animal: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!inquery) {
      throw new NotFoundException(ErrorMessage.INQUERY_NOT_FOUND);
    }

    if (inquery.status === InqueryStatus.PENDING) {
      throw new ForbiddenException(ErrorMessage.INQUERY_PENDING);
    }

    if (
      [InqueryStatus.REJECTED, InqueryStatus.FINISHED].includes(
        inquery.status as InqueryStatus,
      )
    ) {
      throw new ForbiddenException(ErrorMessage.INQUERY_FINISHED);
    }

    const isAuthor = inquery.authorId === authorId;
    const isAnimalAuthor = inquery.animal.authorId === authorId;

    if (!(isAuthor || isAnimalAuthor)) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        inqueryId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      messages,
    };
  }

  async sendMessage(
    dto: SendMessageDto,
    inqueryId: string,
    authorId: GetUserType['id'],
  ) {
    const inquery = await this.prisma.inquery.findUnique({
      where: {
        id: inqueryId,
      },
      select: {
        status: true,
        authorId: true,
        animal: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!inquery) {
      throw new NotFoundException(ErrorMessage.INQUERY_NOT_FOUND);
    }

    if (inquery.status === InqueryStatus.PENDING) {
      throw new ForbiddenException(ErrorMessage.INQUERY_PENDING);
    }

    if (
      [InqueryStatus.REJECTED, InqueryStatus.FINISHED].includes(
        inquery.status as InqueryStatus,
      )
    ) {
      throw new ForbiddenException(ErrorMessage.INQUERY_FINISHED);
    }

    const isAuthor = inquery.authorId === authorId;
    const isAnimalAuthor = inquery.animal.authorId === authorId;

    if (!(isAuthor || isAnimalAuthor)) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const message = await this.prisma.message.create({
      data: {
        authorId,
        inqueryId,
        ...dto,
      },
    });

    return message;
  }
}
