import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { removeFile } from '../image/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dtos';
import { ErrorMessage, UserStatus } from './enums';
import type { GetUserType } from './types';
import { getFullImagePath, getImagePath } from '../image/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: GetUserType['id']) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        picture: true,
        city: true,
        uf: true,
        email: true,
        homeImages: true,
        role: true,
        status: true,
      },
    });

    return {
      ...user,
      avatar: getImagePath(user.avatar),
      picture: getImagePath(user.picture),
      homeImages: user.homeImages.map((image) => ({
        id: image.id,
        src: getImagePath(image.fileName),
      })),
    };
  }

  async getUserById(userId: GetUserType['id']) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          picture: true,
          city: true,
          uf: true,
        },
      });

      if (!user) {
        throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      }

      return {
        ...user,
        avatar: getImagePath(user.avatar),
        picture: getImagePath(user.picture),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async editUser(userId: GetUserType['id'], dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        picture: true,
        city: true,
        uf: true,
        email: true,
        homeImages: true,
        role: true,
        status: true,
      },
    });

    return {
      ...user,
      avatar: getImagePath(user.avatar),
      picture: getImagePath(user.picture),
      homeImages: user.homeImages.map((image) => ({
        id: image.id,
        src: getImagePath(image.fileName),
      })),
    };
  }

  async updateAvatar(userId: GetUserType['id'], fileNames: string[]) {
    const { avatar: oldAvatar, picture: oldPicture } =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          avatar: true,
          picture: true,
        },
      });

    const fullAvatarPath = getFullImagePath(oldAvatar);
    const fullPicturePath = getFullImagePath(oldPicture);

    removeFile(fullAvatarPath);
    removeFile(fullPicturePath);

    const { avatar, picture } = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: fileNames[0],
        picture: fileNames[1],
      },
      select: {
        avatar: true,
        picture: true,
      },
    });

    return {
      avatar: getImagePath(avatar),
      picture: getImagePath(picture),
    };
  }

  async deleteAvatar(userId: GetUserType['id']) {
    try {
      const { avatar, picture } = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          avatar: true,
          picture: true,
        },
      });

      const fullAvatarPath = getFullImagePath(avatar);
      const fullPicturePath = getFullImagePath(picture);

      removeFile(fullAvatarPath);
      removeFile(fullPicturePath);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: null,
          picture: null,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async uploadImage(userId: GetUserType['id'], fileName: string) {
    const { homeImages: prevHomeImages } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        homeImages: true,
      },
    });

    if (prevHomeImages.length >= 6) {
      throw new BadRequestException(ErrorMessage.MAX_IMAGES_QUANTITY_REACHED);
    }

    const { homeImages } = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        homeImages: {
          create: {
            fileName,
          },
        },
      },
      select: {
        homeImages: true,
      },
    });

    return {
      homeImages: homeImages.map((image) => ({
        id: image.id,
        src: getImagePath(image.fileName),
      })),
    };
  }

  async deleteImage(userId: GetUserType['id'], imageId: number) {
    const image = await this.prisma.homeImage.findUnique({
      where: {
        id: imageId,
      },
      select: {
        fileName: true,
        userId: true,
      },
    });

    if (!image) {
      throw new NotFoundException(ErrorMessage.IMAGE_NOT_FOUND);
    }

    if (image.userId !== userId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const fullImagePath = getFullImagePath(image.fileName);

    removeFile(fullImagePath);

    await this.prisma.homeImage.delete({
      where: {
        id: imageId,
      },
    });
  }

  async deleteUser(userId: GetUserType['id']) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async banUser(userId: GetUserType['id']) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.BANNED,
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
  }
}
