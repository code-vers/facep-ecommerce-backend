import { Condition, DiscountType, ShippingFeeType, StockStatus } from '@prisma/client';
import { z } from 'zod';

const productVariantSchema = z.object({
  sku: z.string().min(1, 'Variant SKU is required'),
  image: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  storage: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  stock: z.number().int().min(0, 'Stock cannot be negative')
});

const productSpecificationSchema = z.object({
  name: z.string().min(1, 'Specification name is required'),
  value: z.string().min(1, 'Specification value is required')
});

const createProductValidationSchema = z.object({
  body: z
    .object({
      sku: z.string().min(1, 'SKU is required'),

      // Step 1: Basics
      brand: z.string().optional(),
      productType: z.string().optional(),
      shortDescription: z.string().optional(),
      categoryId: z.string().min(1, 'Category ID is required'),
      subcategoryId: z.string().optional(),
      tags: z.array(z.string()).default([]),
      condition: z.nativeEnum(Condition).default(Condition.NEW),
      availableColors: z.array(z.string()).default([]),

      // Step 2: Media & Variants
      thumbnail: z.string().min(1, 'Thumbnail is required'),
      previewImages: z.array(z.string()).default([]),
      hasVariants: z.boolean().default(false),
      variants: z.array(productVariantSchema).default([]),

      // Step 3: Pricing & Inventory
      basePrice: z.number().min(0, 'Price must be non-negative'),
      oldPrice: z.number().min(0).optional(),
      discountType: z.nativeEnum(DiscountType).optional(),
      discountValue: z.number().min(0).optional(),
      dealBadgeText: z.string().optional(),
      dealStartDate: z.string().datetime().optional(),
      dealEndDate: z.string().datetime().optional(),
      taxAmount: z.number().min(0).optional(),
      vatGst: z.number().min(0).optional(),
      importCharges: z.number().min(0).optional(),
      handlingFee: z.number().min(0).optional(),

      // Step 4: Shipping
      shipsFrom: z.string().min(1, 'Ships from location is required'),
      minDeliveryDays: z.number().int().min(0),
      maxDeliveryDays: z.number().int().min(0),
      shippingFeeType: z.nativeEnum(ShippingFeeType).default(ShippingFeeType.FREE),
      shippingCost: z.number().min(0).optional(),
      shippingZoneId: z.string().optional(),
      courierId: z.string().optional(),
      deliveryStandard: z.boolean().default(false),
      deliveryCod: z.boolean().default(false),
      deliveryExpress: z.boolean().default(false),
      deliveryReturnPickup: z.boolean().default(false),

      // Step 5: Details & Inventory
      specifications: z.array(productSpecificationSchema).default([]),
      keyFeatures: z.string().optional(),
      detailedDescription: z.string().optional(),
      returnPolicy: z.string().optional(),
      returnTerms: z.string().optional(),

      stockQuantity: z.number().int().min(0),
      stockStatus: z.nativeEnum(StockStatus).default(StockStatus.AVAILABLE),
      lowStockAlertQuantity: z.number().int().min(0),
      minOrderQuantity: z.number().int().min(1),
      maxOrderQuantity: z.number().int().min(1),
      inventoryManagedBy: z.string().optional(),
      warehouseLocation: z.string().optional()
    })
    .refine((data) => data.maxDeliveryDays >= data.minDeliveryDays, {
      message: 'Maximum delivery days must be greater than or equal to minimum delivery days',
      path: ['maxDeliveryDays']
    })
    .refine(
      (data) => {
        if (data.shippingFeeType === ShippingFeeType.STANDARD && data.shippingCost === undefined) {
          return false;
        }
        return true;
      },
      {
        message: 'Shipping cost is required when fee type is STANDARD',
        path: ['shippingCost']
      }
    )
    .refine(
      (data) => {
        if (
          data.shippingFeeType === ShippingFeeType.PREDEFINED &&
          !data.shippingZoneId &&
          !data.courierId
        ) {
          return false;
        }
        return true;
      },
      {
        message: 'Either Shipping Zone or Courier is required when fee type is PREDEFINED',
        path: ['shippingFeeType']
      }
    )
    .refine(
      (data) => {
        if (data.hasVariants && data.variants.length === 0) {
          return false;
        }
        return true;
      },
      {
        message: 'At least one variant is required when hasVariants is true',
        path: ['variants']
      }
    )
    .refine(
      (data) => {
        if (data.hasVariants) {
          const skus = data.variants.map((v) => v.sku);
          const uniqueSkus = new Set(skus);
          if (uniqueSkus.size !== skus.length) return false;
        }
        return true;
      },
      {
        message: 'Variant SKUs must be unique',
        path: ['variants']
      }
    )
});

const updateProductValidationSchema = z.object({
  body: z.object({
    sku: z.string().optional(),
    brand: z.string().optional(),
    productType: z.string().optional()
  })
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema
};
