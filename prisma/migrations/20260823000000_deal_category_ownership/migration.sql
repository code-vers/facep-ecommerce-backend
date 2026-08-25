DROP TYPE IF EXISTS "DealAddedBy";
CREATE TYPE "DealAddedBy" AS ENUM ('ADMIN', 'VENDOR');

CREATE TABLE "deals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bannerHeading" TEXT,
    "bannerSubheading" TEXT,
    "bannerImage" TEXT,
    "bannerBgColor" TEXT DEFAULT '#ffca08',
    "user_id" TEXT,
    "added_by" "DealAddedBy",
    "categoryIds" TEXT[],
    "discountStartPercent" DECIMAL(5,2),
    "discountEndPercent" DECIMAL(5,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "deals" ADD CONSTRAINT "deals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
