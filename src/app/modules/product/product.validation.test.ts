import { ProductValidation } from './product.validation';

const validBody = {
  name: 'Wireless Headphones',
  sku: 'HEADPHONE-001',
  categoryId: 'category-id',
  tags: [],
  condition: 'NEW',
  availableColors: ['#000000'],
  thumbnail: '/uploads/products/headphones.webp',
  previewImages: [],
  hasVariants: false,
  variants: [],
  basePrice: 100,
  shipsFrom: 'Dhaka',
  minDeliveryDays: 1,
  maxDeliveryDays: 3,
  shippingFeeType: 'FREE',
  deliveryStandard: true,
  deliveryCod: false,
  deliveryExpress: false,
  deliveryReturnPickup: false,
  specifications: [],
  stockQuantity: 10,
  stockStatus: 'AVAILABLE',
  lowStockAlertQuantity: 2,
  minOrderQuantity: 1,
  maxOrderQuantity: 5,
};

describe('Product validation', () => {
  it('accepts a complete simple product', () => {
    const result = ProductValidation.createProductValidationSchema.safeParse({ body: validBody });
    expect(result.success).toBe(true);
  });

  it('requires the real product name', () => {
    const result = ProductValidation.createProductValidationSchema.safeParse({
      body: { ...validBody, name: '' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid delivery and order ranges', () => {
    const result = ProductValidation.createProductValidationSchema.safeParse({
      body: {
        ...validBody,
        minDeliveryDays: 5,
        maxDeliveryDays: 2,
        minOrderQuantity: 5,
        maxOrderQuantity: 2,
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid discounts', () => {
    const result = ProductValidation.createProductValidationSchema.safeParse({
      body: {
        ...validBody,
        discountType: 'PERCENTAGE',
        discountValue: 101,
      },
    });
    expect(result.success).toBe(false);
  });

  it('requires variants when variants are enabled', () => {
    const result = ProductValidation.createProductValidationSchema.safeParse({
      body: { ...validBody, hasVariants: true },
    });
    expect(result.success).toBe(false);
  });
});
