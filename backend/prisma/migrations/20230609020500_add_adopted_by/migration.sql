-- AlterTable
ALTER TABLE "adnimals" ADD COLUMN     "adoptedById" TEXT;

-- AddForeignKey
ALTER TABLE "adnimals" ADD CONSTRAINT "adnimals_adoptedById_fkey" FOREIGN KEY ("adoptedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
