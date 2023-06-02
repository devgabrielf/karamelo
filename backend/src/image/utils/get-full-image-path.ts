import { join } from 'node:path';

export const getFullImagePath = (fileName: string) => {
  const imagesFolderPath = join(process.cwd(), 'images');
  const fullImagePath = join(imagesFolderPath + '/' + fileName);

  return fullImagePath;
};
