/*
  Warnings:

  - You are about to drop the column `fileName` on the `animalImages` table. All the data in the column will be lost.
  - Added the required column `src` to the `animalImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "animalImages" DROP COLUMN "fileName",
ADD COLUMN     "src" TEXT NOT NULL;
