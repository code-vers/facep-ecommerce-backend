ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "name" TEXT,
ADD COLUMN IF NOT EXISTS "slug" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "products"
SET
  "name" = COALESCE(
    NULLIF(TRIM("name"), ''),
    NULLIF(TRIM("brand"), ''),
    NULLIF(TRIM("productType"), ''),
    NULLIF(TRIM("shortDescription"), ''),
    "sku"
  ),
  "slug" = LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        COALESCE(
          NULLIF(TRIM("brand"), ''),
          NULLIF(TRIM("productType"), ''),
          NULLIF(TRIM("shortDescription"), ''),
          "sku"
        ),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      ),
      '(^-|-$)',
      '',
      'g'
    )
  ) || '-' || SUBSTRING(REPLACE("id", '-', ''), 1, 8);

ALTER TABLE "products"
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_key" ON "products"("slug");
CREATE INDEX IF NOT EXISTS "products_vendorId_createdAt_idx" ON "products"("vendorId", "createdAt");
CREATE INDEX IF NOT EXISTS "products_isActive_createdAt_idx" ON "products"("isActive", "createdAt");
CREATE INDEX IF NOT EXISTS "products_categoryId_isActive_idx" ON "products"("categoryId", "isActive");
CREATE INDEX IF NOT EXISTS "products_subcategoryId_isActive_idx" ON "products"("subcategoryId", "isActive");
CREATE INDEX IF NOT EXISTS "products_basePrice_idx" ON "products"("basePrice");
CREATE INDEX IF NOT EXISTS "products_stockStatus_idx" ON "products"("stockStatus");
