/*
  Warnings:

  - The primary key for the `animalImages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileName` on the `animalImages` table. All the data in the column will be lost.
  - The primary key for the `homeImages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileName` on the `homeImages` table. All the data in the column will be lost.
  - Added the required column `src` to the `animalImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `src` to the `homeImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "animalImages" DROP CONSTRAINT "animalImages_pkey",
DROP COLUMN "fileName",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "src" TEXT NOT NULL,
ADD CONSTRAINT "animalImages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "homeImages" DROP CONSTRAINT "homeImages_pkey",
DROP COLUMN "fileName",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "src" TEXT NOT NULL,
ADD CONSTRAINT "homeImages_pkey" PRIMARY KEY ("id");
