DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DealAddedBy') THEN
    CREATE TYPE "DealAddedBy" AS ENUM ('ADMIN', 'VENDOR');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "deals" (
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

ALTER TABLE "deals"
  ADD COLUMN IF NOT EXISTS "user_id" TEXT,
  ADD COLUMN IF NOT EXISTS "added_by" "DealAddedBy";

UPDATE "deals" SET "added_by" = 'ADMIN' WHERE "added_by" IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'deals_user_id_fkey'
  ) THEN
    ALTER TABLE "deals"
      ADD CONSTRAINT "deals_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
