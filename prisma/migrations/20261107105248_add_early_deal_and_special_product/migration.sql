-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isEarlyDeal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSpecialProduct" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "product_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewer_name" TEXT NOT NULL,
    "reviewer_avatar" TEXT,
    "reply_text" TEXT,
    "reply_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_storefronts" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "store_name" TEXT,
    "store_logo" TEXT,
    "store_banner" TEXT,
    "banner_headline" TEXT,
    "banner_subheadline" TEXT,
    "store_description" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "return_policy" TEXT,
    "shipping_policy" TEXT,
    "warranty_information" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_storefronts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_product_id_created_at_idx" ON "reviews"("product_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_storefronts_vendor_id_key" ON "vendor_storefronts"("vendor_id");

-- CreateIndex
CREATE INDEX "products_isEarlyDeal_idx" ON "products"("isEarlyDeal");

-- CreateIndex
CREATE INDEX "products_isSpecialProduct_idx" ON "products"("isSpecialProduct");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_storefronts" ADD CONSTRAINT "vendor_storefronts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
