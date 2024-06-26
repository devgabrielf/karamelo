import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkAsAdoptedDto, RegisterAnimalDto } from './dtos';
import { AnimalStatus, ErrorMessage, Species } from './enums';
import type { GetUserType } from '../user/types';
import { UserRole } from '../user/enums';
import { nanoid } from 'nanoid';
import { InqueryStatus } from '../inquery/enums';
import { getImagePath } from '../image/utils';
import { Inquery } from '@prisma/client';

@Injectable()
export class AnimalService {
  constructor(private prisma: PrismaService) {}

  async getAnimalById(animalId: string, user?: GetUserType) {
    const animal = await this.prisma.animal.findUnique({
      where: {
        id: animalId,
      },
      select: {
        id: true,
        name: true,
        pictures: true,
        description: true,
        species: true,
        months: true,
        city: true,
        uf: true,
        sex: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            avatar: true,
            name: true,
          },
        },
      },
    });

    const isAdmin = user?.role === UserRole.ADMIN;

    if (
      !animal ||
      (animal.status !== AnimalStatus.APPROVED && !isAdmin) ||
      (isAdmin &&
        ![AnimalStatus.APPROVED, AnimalStatus.PENDING].includes(
          animal.status as AnimalStatus,
        ))
    ) {
      throw new NotFoundException(ErrorMessage.ANIMAL_NOT_FOUND);
    }

    let inquery: Inquery;

    if (user) {
      inquery = await this.prisma.inquery.findFirst({
        where: {
          animalId: animal.id,
          authorId: user.id,
        },
      });
    }

    return {
      ...animal,
      author: {
        ...animal.author,
        avatar: getImagePath(animal.author.avatar),
      },
      pictures: animal.pictures.map(({ id, fileName }) => ({
        id,
        src: getImagePath(fileName),
      })),
      inquery,
    };
  }

  async getAnimalsByAuthorId(authorId: GetUserType['id']) {
    const animals = await this.prisma.animal.findMany({
      where: {
        authorId,
      },
      select: {
        id: true,
        name: true,
        months: true,
        pictures: true,
        city: true,
        uf: true,
        sex: true,
        species: true,
        status: true,
        createdAt: true,
      },
    });

    return animals.map((animal) => ({
      ...animal,
      pictures: animal.pictures.map(({ id, fileName }) => ({
        id,
        src: getImagePath(fileName),
      })),
    }));
  }

  async getAnimals(
    limit: number,
    offset: number,
    species?: Species,
    uf?: string,
    city?: string,
  ) {
    const [total, animals] = await this.prisma.$transaction([
      this.prisma.animal.count({
        where: {
          status: AnimalStatus.APPROVED,
          species,
          uf,
          city,
        },
      }),
      this.prisma.animal.findMany({
        select: {
          id: true,
          name: true,
          months: true,
          pictures: true,
          city: true,
          uf: true,
          sex: true,
          species: true,
          status: true,
          createdAt: true,
        },
        where: {
          status: AnimalStatus.APPROVED,
          species,
          uf,
          city,
        },
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    return {
      total,
      animals: animals.map((animal) => ({
        ...animal,
        pictures: animal.pictures.map(({ id, fileName }) => ({
          id,
          src: getImagePath(fileName),
        })),
      })),
    };
  }

  async getPendingAnimals() {
    const animals = await this.prisma.animal.findMany({
      select: {
        id: true,
        name: true,
        months: true,
        pictures: true,
        city: true,
        uf: true,
        sex: true,
        species: true,
        status: true,
        createdAt: true,
      },
      where: {
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return animals.map((animal) => ({
      ...animal,
      pictures: animal.pictures.map(({ id, fileName }) => ({
        id,
        src: getImagePath(fileName),
      })),
    }));
  }

  async registerAnimal(
    { pictures, ...rest }: RegisterAnimalDto,
    authorId: GetUserType['id'],
  ) {
    const id = nanoid(8);

    const animal = await this.prisma.animal.create({
      data: {
        id,
        authorId,
        pictures: {
          createMany: {
            data: pictures.map((picture) => ({
              fileName: picture,
            })),
          },
        },
        ...rest,
      },
    });

    const addedPictures = await this.prisma.animalImage.findMany({
      where: {
        animalId: animal.id,
      },
      select: {
        id: true,
        fileName: true,
      },
    });

    return {
      ...animal,
      pictures: addedPictures.map(({ id, fileName }) => ({
        id,
        src: getImagePath(fileName),
      })),
    };
  }

  async evaluteAnimal(
    animalId: string,
    status: AnimalStatus.APPROVED | AnimalStatus.REJECTED,
  ) {
    const animal = await this.prisma.animal.findUnique({
      where: {
        id: animalId,
      },
    });

    if (!animal) {
      throw new NotFoundException(ErrorMessage.ANIMAL_NOT_FOUND);
    }

    if (animal.status !== AnimalStatus.PENDING) {
      throw new BadRequestException(ErrorMessage.ANIMAL_NOT_PENDING);
    }

    await this.prisma.animal.update({
      where: {
        id: animalId,
      },
      data: {
        status,
      },
    });
  }

  async markAsAdopted(
    dto: MarkAsAdoptedDto,
    animalId: string,
    userId: GetUserType['id'],
  ) {
    const animal = await this.prisma.animal.findUnique({
      where: {
        id: animalId,
      },
      select: {
        authorId: true,
        status: true,
        inqueries: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!animal) {
      throw new NotFoundException(ErrorMessage.ANIMAL_NOT_FOUND);
    }

    if (animal.authorId !== userId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    if (animal.status === AnimalStatus.ADOPTED) {
      throw new BadRequestException(ErrorMessage.ANIMAL_ALREADY_ADOPTED);
    }

    if (animal.status !== AnimalStatus.APPROVED) {
      throw new BadRequestException(ErrorMessage.ANIMAL_NOT_PENDING);
    }

    if (
      !animal.inqueries
        .map((inquery) => inquery.authorId)
        .includes(dto.adopterId)
    ) {
      throw new BadRequestException(ErrorMessage.USER_NOT_INQUERIER);
    }

    await this.prisma.$transaction([
      this.prisma.animal.update({
        where: {
          id: animalId,
        },
        data: {
          status: AnimalStatus.ADOPTED,
          adoptedById: dto.adopterId,
        },
      }),
      this.prisma.inquery.updateMany({
        where: {
          animalId,
        },
        data: {
          status: InqueryStatus.FINISHED,
        },
      }),
    ]);
  }
}
