import * as fs from 'node:fs';
import { join } from 'node:path';

const source = './images';
const destination = '../../images';

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const copyFile = (fileName: string) => {
  const sourceFile = join(__dirname, source, fileName);
  const destinationFile = join(__dirname, destination, fileName);

  fs.copyFileSync(sourceFile, destinationFile);
};

export const copyImages = () => {
  fs.readdir(join(__dirname, destination), (error, files) => {
    if (error) {
      console.error('Error reading destination folder:', error);
      return;
    }

    files.forEach((file) => {
      if (file !== '.placeholder') {
        fs.unlinkSync(join(__dirname, destination, file));
      }
    });
  });

  fs.readdir(join(__dirname, source), (error, files) => {
    if (error) {
      console.error('Error reading source folder:', error);
      return;
    }

    files.forEach(copyFile);
  });
};
