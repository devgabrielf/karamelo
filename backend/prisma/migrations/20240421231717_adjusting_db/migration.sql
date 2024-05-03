/*
  Warnings:

  - You are about to drop the column `src` on the `animalImages` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `animalImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "animalImages" DROP COLUMN "src",
ADD COLUMN     "fileName" TEXT NOT NULL;
