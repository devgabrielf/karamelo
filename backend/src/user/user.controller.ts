import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser, Public } from '../auth/decorators';
import { EditUserDto } from './dtos';
import { UserRole } from './enums';
import { UserService } from './user.service';
import type { GetUserType } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from '../image/helpers';
import { switchMap } from 'rxjs';
import { getFullImagePath } from '../image/utils';
import { SharpPipe } from '../image/sharp.pipe';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') userId: GetUserType['id']) {
    return this.userService.getMe(userId);
  }

  @Get(':id')
  @Public()
  getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Patch('me')
  editUser(@GetUser('id') userId: GetUserType['id'], @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  updateAvatar(
    @GetUser('id') userId: GetUserType['id'],
    @UploadedFile(new SharpPipe({ resized: true })) fileNames: string[],
  ) {
    if (!fileNames) {
      throw new BadRequestException('File must be a png or jpg.');
    }

    const fullImagePathSmall = getFullImagePath(fileNames[0]);
    const fullImagePathBig = getFullImagePath(fileNames[1]);

    return isFileExtensionSafe(fullImagePathSmall).pipe(
      switchMap(async (isFileLegit: boolean) => {
        if (isFileLegit) {
          return this.userService.updateAvatar(userId, fileNames);
        }

        removeFile(fullImagePathSmall);
        removeFile(fullImagePathBig);
        throw new BadRequestException('File content does not match extension.');
      }),
    );
  }

  @Delete('me/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAvatar(@GetUser('id') userId: GetUserType['id']) {
    this.userService.deleteAvatar(userId);
  }

  @Post('me/images')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @GetUser('id') userId: GetUserType['id'],
    @UploadedFile(new SharpPipe()) fileName: string,
  ) {
    if (!fileName) {
      throw new BadRequestException('File must be a png or jpg.');
    }

    const fullImagePath = getFullImagePath(fileName);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap(async (isFileLegit: boolean) => {
        if (isFileLegit) {
          return this.userService.uploadImage(userId, fileName);
        }

        removeFile(fullImagePath);
        throw new BadRequestException('File content does not match extension.');
      }),
    );
  }

  @Delete('me/images/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteImage(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id', ParseIntPipe) imageId: number,
  ) {
    this.userService.deleteImage(userId, imageId);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@GetUser() userId: GetUserType['id']) {
    this.userService.deleteUser(userId);
  }

  @Post(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banUser(
    @GetUser('role') role: GetUserType['role'],
    @Param('id') userId: string,
  ) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.userService.banUser(userId);
  }
}
