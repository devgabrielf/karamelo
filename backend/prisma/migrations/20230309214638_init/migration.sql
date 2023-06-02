-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeImages" (
    "fileName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "homeImages_pkey" PRIMARY KEY ("fileName")
);

-- CreateTable
CREATE TABLE "adnimals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "months" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "authorId" TEXT NOT NULL,

    CONSTRAINT "adnimals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animalImages" (
    "fileName" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,

    CONSTRAINT "animalImages_pkey" PRIMARY KEY ("fileName")
);

-- CreateTable
CREATE TABLE "inqueries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "animalId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "inqueries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "inqueryId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportType" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "authorId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "homeImages" ADD CONSTRAINT "homeImages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adnimals" ADD CONSTRAINT "adnimals_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animalImages" ADD CONSTRAINT "animalImages_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "adnimals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inqueries" ADD CONSTRAINT "inqueries_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "adnimals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inqueries" ADD CONSTRAINT "inqueries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_inqueryId_fkey" FOREIGN KEY ("inqueryId") REFERENCES "inqueries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
