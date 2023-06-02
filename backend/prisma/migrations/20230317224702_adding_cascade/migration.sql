-- DropForeignKey
ALTER TABLE "UserReport" DROP CONSTRAINT "UserReport_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserReport" DROP CONSTRAINT "UserReport_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "adnimals" DROP CONSTRAINT "adnimals_authorId_fkey";

-- DropForeignKey
ALTER TABLE "animalImages" DROP CONSTRAINT "animalImages_animalId_fkey";

-- DropForeignKey
ALTER TABLE "homeImages" DROP CONSTRAINT "homeImages_userId_fkey";

-- DropForeignKey
ALTER TABLE "inqueries" DROP CONSTRAINT "inqueries_animalId_fkey";

-- DropForeignKey
ALTER TABLE "inqueries" DROP CONSTRAINT "inqueries_authorId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_inqueryId_fkey";

-- AlterTable
ALTER TABLE "adnimals" ALTER COLUMN "months" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "homeImages" ADD CONSTRAINT "homeImages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adnimals" ADD CONSTRAINT "adnimals_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animalImages" ADD CONSTRAINT "animalImages_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "adnimals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inqueries" ADD CONSTRAINT "inqueries_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "adnimals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inqueries" ADD CONSTRAINT "inqueries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_inqueryId_fkey" FOREIGN KEY ("inqueryId") REFERENCES "inqueries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
