import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { of, switchMap } from 'rxjs';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from './helpers';
import { getFullImagePath, getImagePath } from './utils';
import { SharpPipe } from './sharp.pipe';

@Controller('images')
export class ImageController {
  @Post()
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(@UploadedFile(new SharpPipe()) fileName: string) {
    if (!fileName) {
      throw new BadRequestException('File must be a png or jpg.');
    }

    const fullImagePath = getFullImagePath(fileName);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          return of({
            src: getImagePath(fileName),
          });
        }

        removeFile(fullImagePath);
        throw new BadRequestException('File content does not match extension.');
      }),
    );
  }
}
