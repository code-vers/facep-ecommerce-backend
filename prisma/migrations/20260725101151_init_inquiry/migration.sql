-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'REPLIED');

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);
