import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'node:path';
import * as sharp from 'sharp';
import { removeFile } from './helpers';

export type SharpPipeOptions = {
  resized?: boolean;
};

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string | string[]>>
{
  constructor(private options: SharpPipeOptions = {}) {}

  async transform(image: Express.Multer.File): Promise<string | string[]> {
    if (!image) {
      return null;
    }

    const originalName = path.parse(image.filename).name;
    const fileName = `${originalName}_.jpg`;

    const normalImage = sharp(image.path).jpeg({ quality: 50 });

    if (this.options.resized) {
      const resizedImage = sharp(image.path).jpeg({ quality: 50 }).resize({
        width: 80,
        height: 80,
        fit: 'cover',
      });

      const resizedFileName = `${originalName}_small.jpg`;

      await Promise.all([
        normalImage.toFile(path.join('images', fileName)),
        resizedImage.toFile(path.join('images', resizedFileName)),
      ]);

      removeFile(image.path);

      return [resizedFileName, fileName];
    }

    await normalImage.toFile(path.join('images', fileName));

    removeFile(image.path);

    return fileName;
  }
}
