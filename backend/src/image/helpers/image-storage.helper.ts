import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { from, of, switchMap } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as FileType from 'file-type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

type ValidFileExtension = 'png' | 'jpg';
type ValidMimeType = 'image/png' | 'image/jpeg';

const validFileExtensions = ['png', 'jpg'];
const validMimeTypes = ['image/png', 'image/jpeg'];

export const saveImageToStorage: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (_req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = nanoid(8) + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = validMimeTypes;
    cb(null, allowedMimeTypes.includes(file.mimetype));
  },
};

export const isFileExtensionSafe = (fullFilePath: string) => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtensionAndMimeType: {
        ext: ValidFileExtension;
        mime: ValidMimeType;
      }) => {
        if (!fileExtensionAndMimeType) {
          return of(false);
        }

        const isFileTypeLegit = validFileExtensions.includes(
          fileExtensionAndMimeType.ext,
        );
        const isMimeTypeLegit = validMimeTypes.includes(
          fileExtensionAndMimeType.mime,
        );
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;

        return of(isFileLegit);
      },
    ),
  );
};

export const removeFile = (fullFilePath: string) => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {}
};
