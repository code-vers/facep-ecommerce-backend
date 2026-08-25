-- Deals keep their category IDs directly. The service enforces the category
-- exclusivity rule using the deal creator and added_by fields.
CREATE TYPE "DealAddedBy" AS ENUM ('ADMIN', 'VENDOR');

ALTER TABLE "deals"
  ADD COLUMN "user_id" TEXT,
  ADD COLUMN "added_by" "DealAddedBy";

-- Before this migration, only administrators could create deals. Preserve that
-- behaviour so existing categories remain unavailable to new admin deals.
UPDATE "deals" SET "added_by" = 'ADMIN' WHERE "added_by" IS NULL;

ALTER TABLE "deals"
  ADD CONSTRAINT "deals_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
