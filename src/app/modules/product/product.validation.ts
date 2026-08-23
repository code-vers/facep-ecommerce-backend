import { Condition, DiscountType, ShippingFeeType, StockStatus } from '@prisma/client';
import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).optional();
const optionalId = z.string().trim().min(1).optional();
const colorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Color must be a valid hex value');

const productVariantSchema = z.object({
  sku: z.string().trim().min(1, 'Variant SKU is required').max(100),
  image: optionalText(500),
  color: optionalText(50),
  size: optionalText(50),
  material: optionalText(100),
  storage: optionalText(100),
  price: z.number().finite().min(0, 'Price must be non-negative'),
  stock: z.number().int().min(0, 'Stock cannot be negative')
});

const productSpecificationSchema = z.object({
  name: z.string().trim().min(1, 'Specification name is required').max(100),
  value: z.string().trim().min(1, 'Specification value is required').max(500)
});

const productBodySchema = z
  .object({
    name: z.string().trim().min(2, 'Product name is required').max(200),
    sku: z.string().trim().min(1, 'SKU is required').max(100),
    brand: optionalText(150),
    productType: optionalText(150),
    shortDescription: optionalText(1000),
    categoryId: z.string().trim().min(1, 'Category ID is required'),
    subcategoryId: optionalId,
    tags: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
    condition: z.nativeEnum(Condition).default(Condition.NEW),
    availableColors: z.array(colorSchema).max(30).default([]),
    thumbnail: z.string().trim().min(1, 'Thumbnail is required').max(500),
    previewImages: z.array(z.string().trim().min(1).max(500)).max(10).default([]),
    hasVariants: z.boolean().default(false),
    variants: z.array(productVariantSchema).max(100).default([]),
    basePrice: z.number().finite().min(0, 'Price must be non-negative'),
    oldPrice: z.number().finite().min(0).optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.number().finite().min(0).optional(),
    dealBadgeText: optionalText(100),
    dealStartDate: z.string().datetime().optional(),
    dealEndDate: z.string().datetime().optional(),
    taxAmount: z.number().finite().min(0).optional(),
    vatGst: z.number().finite().min(0).optional(),
    importCharges: z.number().finite().min(0).optional(),
    handlingFee: z.number().finite().min(0).optional(),
    shipsFrom: z.string().trim().min(1, 'Ships from location is required').max(200),
    minDeliveryDays: z.number().int().min(0),
    maxDeliveryDays: z.number().int().min(0),
    shippingFeeType: z.nativeEnum(ShippingFeeType).default(ShippingFeeType.FREE),
    shippingCost: z.number().finite().min(0).optional(),
    shippingZoneId: optionalId,
    courierId: optionalId,
    deliveryStandard: z.boolean().default(false),
    deliveryCod: z.boolean().default(false),
    deliveryExpress: z.boolean().default(false),
    deliveryReturnPickup: z.boolean().default(false),
    specifications: z.array(productSpecificationSchema).max(100).default([]),
    keyFeatures: optionalText(50000),
    detailedDescription: optionalText(100000),
    returnPolicy: optionalText(200),
    returnTerms: optionalText(10000),
    stockQuantity: z.number().int().min(0),
    stockStatus: z.nativeEnum(StockStatus).default(StockStatus.AVAILABLE),
    lowStockAlertQuantity: z.number().int().min(0),
    minOrderQuantity: z.number().int().min(1),
    maxOrderQuantity: z.number().int().min(1),
    inventoryManagedBy: optionalText(150),
    warehouseLocation: optionalText(300),
    isActive: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message });

    if (data.maxDeliveryDays < data.minDeliveryDays) {
      issue('maxDeliveryDays', 'Maximum delivery days must be at least minimum delivery days');
    }
    if (data.maxOrderQuantity < data.minOrderQuantity) {
      issue('maxOrderQuantity', 'Maximum order quantity must be at least minimum order quantity');
    }
    if (data.oldPrice !== undefined && data.oldPrice < data.basePrice) {
      issue('oldPrice', 'Old price cannot be lower than base price');
    }
    if ((data.discountType === undefined) !== (data.discountValue === undefined)) {
      issue('discountValue', 'Discount type and value must be provided together');
    }
    if (data.discountType === DiscountType.PERCENTAGE && (data.discountValue ?? 0) > 100) {
      issue('discountValue', 'Percentage discount cannot exceed 100');
    }
    if (data.discountType === DiscountType.FIXED && (data.discountValue ?? 0) > data.basePrice) {
      issue('discountValue', 'Fixed discount cannot exceed base price');
    }
    if (
      data.dealStartDate &&
      data.dealEndDate &&
      new Date(data.dealEndDate) <= new Date(data.dealStartDate)
    ) {
      issue('dealEndDate', 'Deal end date must be after start date');
    }
    if (data.shippingFeeType === ShippingFeeType.STANDARD && data.shippingCost === undefined) {
      issue('shippingCost', 'Shipping cost is required for standard shipping');
    }
    if (
      data.shippingFeeType === ShippingFeeType.PREDEFINED &&
      !data.shippingZoneId &&
      !data.courierId
    ) {
      issue('shippingFeeType', 'A shipping zone or courier is required');
    }
    if (data.hasVariants && data.variants.length === 0) {
      issue('variants', 'At least one variant is required');
    }
    if (!data.hasVariants && data.variants.length > 0) {
      issue('variants', 'Variants must be empty when variants are disabled');
    }
    const variantSkus = data.variants.map((variant) => variant.sku.toLowerCase());
    if (new Set(variantSkus).size !== variantSkus.length) {
      issue('variants', 'Variant SKUs must be unique');
    }
    const combinations = data.variants.map((variant) =>
      [variant.color, variant.size, variant.material, variant.storage]
        .map((value) => value?.trim().toLowerCase() ?? '')
        .join('|')
    );
    if (
      data.hasVariants &&
      combinations.some(Boolean) &&
      new Set(combinations).size !== combinations.length
    ) {
      issue('variants', 'Variant option combinations must be unique');
    }
    if (
      !data.hasVariants &&
      data.stockStatus === StockStatus.OUT_OF_STOCK &&
      data.stockQuantity > 0
    ) {
      issue('stockStatus', 'A product with stock must be available');
    }
  });

const createProductValidationSchema = z.object({ body: productBodySchema });
const updateProductValidationSchema = z.object({ body: productBodySchema });
const updateStatusValidationSchema = z.object({ body: z.object({ isActive: z.boolean() }) });

const productPromotionBodySchema = z
  .object({
    discountType: z.nativeEnum(DiscountType),
    discountValue: z.number().finite().positive('Discount must be greater than zero'),
    dealBadgeText: optionalText(100),
    dealStartDate: z.string().datetime().optional(),
    dealEndDate: z.string().datetime().optional()
  })
  .superRefine((data, ctx) => {
    if (data.discountType === DiscountType.PERCENTAGE && data.discountValue > 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['discountValue'],
        message: 'Percentage discount cannot exceed 100'
      });
    }
    if (
      data.dealStartDate &&
      data.dealEndDate &&
      new Date(data.dealEndDate) <= new Date(data.dealStartDate)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['dealEndDate'],
        message: 'Deal end date must be after start date'
      });
    }
  });

const updateProductPromotionValidationSchema = z.object({ body: productPromotionBodySchema });

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
  updateStatusValidationSchema,
  updateProductPromotionValidationSchema
};
