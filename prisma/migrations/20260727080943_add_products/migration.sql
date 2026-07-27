-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'RENEWED', 'USED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "ShippingFeeType" AS ENUM ('FREE', 'STANDARD', 'PREDEFINED');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "brand" TEXT,
    "productType" TEXT,
    "shortDescription" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "tags" TEXT[],
    "condition" "Condition" NOT NULL DEFAULT 'NEW',
    "availableColors" TEXT[],
    "thumbnail" TEXT NOT NULL,
    "previewImages" TEXT[],
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "oldPrice" DECIMAL(10,2),
    "discountType" "DiscountType",
    "discountValue" DECIMAL(10,2),
    "dealBadgeText" TEXT,
    "dealStartDate" TIMESTAMP(3),
    "dealEndDate" TIMESTAMP(3),
    "taxAmount" DECIMAL(10,2),
    "vatGst" DECIMAL(10,2),
    "importCharges" DECIMAL(10,2),
    "handlingFee" DECIMAL(10,2),
    "shipsFrom" TEXT NOT NULL,
    "minDeliveryDays" INTEGER NOT NULL,
    "maxDeliveryDays" INTEGER NOT NULL,
    "shippingFeeType" "ShippingFeeType" NOT NULL DEFAULT 'FREE',
    "shippingCost" DECIMAL(10,2),
    "shippingZoneId" TEXT,
    "courierId" TEXT,
    "deliveryStandard" BOOLEAN NOT NULL DEFAULT false,
    "deliveryCod" BOOLEAN NOT NULL DEFAULT false,
    "deliveryExpress" BOOLEAN NOT NULL DEFAULT false,
    "deliveryReturnPickup" BOOLEAN NOT NULL DEFAULT false,
    "keyFeatures" TEXT,
    "detailedDescription" TEXT,
    "returnPolicy" TEXT,
    "returnTerms" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "stockStatus" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "lowStockAlertQuantity" INTEGER NOT NULL,
    "minOrderQuantity" INTEGER NOT NULL,
    "maxOrderQuantity" INTEGER NOT NULL,
    "inventoryManagedBy" TEXT,
    "warehouseLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "image" TEXT,
    "color" TEXT,
    "size" TEXT,
    "material" TEXT,
    "storage" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specifications" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shippingZoneId_fkey" FOREIGN KEY ("shippingZoneId") REFERENCES "shipping_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
