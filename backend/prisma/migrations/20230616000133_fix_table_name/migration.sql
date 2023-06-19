/*
  Warnings:

  - You are about to drop the `adnimals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "adnimals" DROP CONSTRAINT "adnimals_adoptedById_fkey";

-- DropForeignKey
ALTER TABLE "adnimals" DROP CONSTRAINT "adnimals_authorId_fkey";

-- DropForeignKey
ALTER TABLE "animalImages" DROP CONSTRAINT "animalImages_animalId_fkey";

-- DropForeignKey
ALTER TABLE "inqueries" DROP CONSTRAINT "inqueries_animalId_fkey";

-- DropTable
DROP TABLE "adnimals";

-- CreateTable
CREATE TABLE "animals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "months" INTEGER,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "authorId" TEXT NOT NULL,
    "adoptedById" TEXT,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_adoptedById_fkey" FOREIGN KEY ("adoptedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animalImages" ADD CONSTRAINT "animalImages_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inqueries" ADD CONSTRAINT "inqueries_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
