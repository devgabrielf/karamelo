import { PrismaClient } from '@prisma/client';
import { animalImage, animal, homeImage, inquery, user } from './data';
import { copyImages } from './copyImages';

const prisma = new PrismaClient();

const columns = Object.entries({
  user,
  homeImage,
  animal,
  animalImage,
  inquery,
});

const main = async () => {
  copyImages();

  for (const column of columns) {
    for (const item of column[1]) {
      await prisma[column[0] as string].create({
        data: item,
      });
    }
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
