-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "shipments" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_zones" (
    "id" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "countries" TEXT NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,
    "perKgRate" DECIMAL(10,2) NOT NULL,
    "isFreeShipping" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "couriers_name_key" ON "couriers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_zones_zoneName_key" ON "shipping_zones"("zoneName");
