-- Create the base deals table before the following ownership migration adds
-- its creator and added-by fields. IF NOT EXISTS supports databases where the
-- table was previously introduced through a schema push.
CREATE TABLE IF NOT EXISTS "deals" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "bannerHeading" TEXT,
  "bannerSubheading" TEXT,
  "bannerImage" TEXT,
  "bannerBgColor" TEXT DEFAULT '#ffca08',
  "categoryIds" TEXT[] NOT NULL,
  "discountStartPercent" DECIMAL(5,2),
  "discountEndPercent" DECIMAL(5,2),
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);
