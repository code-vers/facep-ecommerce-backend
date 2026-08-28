-- Establish product ownership before public-catalog indexes reference vendorId.
-- The guards support databases where this transition was previously applied
-- through a schema push or through the original, now-restored migration entry.
ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "vendorId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_vendorId_fkey'
  ) THEN
    ALTER TABLE "products"
    ADD CONSTRAINT "products_vendorId_fkey"
    FOREIGN KEY ("vendorId") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
