import { Prisma, StockStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

interface ProductVariantInput {
  sku: string;
  image?: string;
  color?: string;
  size?: string;
  material?: string;
  storage?: string;
  price: number;
  stock: number;
}

interface ProductSpecificationInput {
  name: string;
  value: string;
}

interface ProductPayload {
  name?: string;
  sku?: string;
  variants?: ProductVariantInput[];
  specifications?: ProductSpecificationInput[];
  tags?: string[];
  availableColors?: string[];
  previewImages?: string[];
  isActive?: boolean;
  [key: string]: unknown;
}

type Query = Record<string, unknown>;

const productInclude = {
  category: true,
  subcategory: true,
  vendor: { select: { id: true, name: true } },
  variants: true,
  specifications: true,
  shippingZone: true,
  courier: true
} satisfies Prisma.ProductInclude;

const cleanTextArray = (values?: string[]) => [
  ...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))
];

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product';

const createUniqueSlug = async (name: string, productId?: string) => {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(productId ? { id: { not: productId } } : {}) },
      select: { id: true }
    })
  ) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

const assertReferences = async (payload: ProductPayload) => {
  if (payload.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: String(payload.categoryId), isActive: true },
      select: { id: true }
    });
    if (!category) throw new AppError(400, 'Selected category is unavailable');
  }
  if (payload.subcategoryId) {
    const subcategory = await prisma.subcategory.findFirst({
      where: {
        id: String(payload.subcategoryId),
        ...(payload.categoryId ? { categoryId: String(payload.categoryId) } : {})
      },
      select: { id: true }
    });
    if (!subcategory) throw new AppError(400, 'Subcategory does not belong to selected category');
  }
  if (payload.shippingZoneId) {
    const zone = await prisma.shippingZone.findFirst({
      where: { id: String(payload.shippingZoneId), isActive: true },
      select: { id: true }
    });
    if (!zone) throw new AppError(400, 'Selected shipping zone is unavailable');
  }
  if (payload.courierId) {
    const courier = await prisma.courier.findFirst({
      where: { id: String(payload.courierId), isActive: true },
      select: { id: true }
    });
    if (!courier) throw new AppError(400, 'Selected courier is unavailable');
  }
};

const assertUniqueSkus = async (payload: ProductPayload, productId?: string) => {
  if (payload.sku) {
    const product = await prisma.product.findFirst({
      where: { sku: payload.sku, ...(productId ? { id: { not: productId } } : {}) },
      select: { id: true }
    });
    if (product) throw new AppError(400, 'Product with this SKU already exists');
  }
  const variantSkus = payload.variants?.map((variant) => variant.sku) ?? [];
  if (variantSkus.length) {
    const variant = await prisma.productVariant.findFirst({
      where: {
        sku: { in: variantSkus },
        ...(productId ? { productId: { not: productId } } : {})
      },
      select: { sku: true }
    });
    if (variant) throw new AppError(400, `Variant SKU ${variant.sku} already exists`);
  }
};

const normalizePayload = (payload: ProductPayload): ProductPayload => ({
  ...payload,
  name: payload.name?.trim(),
  sku: payload.sku?.trim(),
  brand: typeof payload.brand === 'string' ? payload.brand.trim() || undefined : payload.brand,
  productType:
    typeof payload.productType === 'string'
      ? payload.productType.trim() || undefined
      : payload.productType,
  shortDescription:
    typeof payload.shortDescription === 'string'
      ? payload.shortDescription.trim() || undefined
      : payload.shortDescription,
  tags: cleanTextArray(payload.tags),
  availableColors: cleanTextArray(payload.availableColors),
  previewImages: cleanTextArray(payload.previewImages),
  specifications: (payload.specifications ?? []).filter(
    (specification) => specification.name.trim() && specification.value.trim()
  )
});

const relationSafeData = (payload: ProductPayload) => {
  const data = { ...payload };
  delete data.variants;
  delete data.specifications;
  delete data.vendorId;
  delete data.slug;
  delete data.vendor;
  delete data.category;
  delete data.subcategory;
  delete data.shippingZone;
  delete data.courier;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.publishedAt;
  return data;
};

const createProduct = async (vendorId: string, rawPayload: ProductPayload) => {
  const payload = normalizePayload(rawPayload);
  await Promise.all([assertReferences(payload), assertUniqueSkus(payload)]);
  const slug = await createUniqueSlug(payload.name!);

  return prisma.$transaction((tx) =>
    tx.product.create({
      data: {
        ...(relationSafeData(payload) as unknown as Prisma.ProductUncheckedCreateInput),
        name: payload.name!,
        sku: payload.sku!,
        slug,
        vendorId,
        isActive: payload.isActive ?? true,
        tags: payload.tags ?? [],
        availableColors: payload.availableColors ?? [],
        previewImages: payload.previewImages ?? [],
        variants: payload.variants?.length ? { create: payload.variants } : undefined,
        specifications: payload.specifications?.length
          ? { create: payload.specifications }
          : undefined
      },
      include: productInclude
    })
  );
};

const parsePositiveInt = (value: unknown, fallback: number, maximum = 100) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
};

const publicWhere = (query: Query): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [
    { isActive: true },
    { category: { isActive: true } }
  ];
  const search = String(query.search ?? query.searchTerm ?? '').trim();
  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { productType: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    });
  }
  const category = String(query.categoryId ?? query.category ?? '').trim();
  if (category) {
    conditions.push({
      OR: [
        { categoryId: category },
        { category: { name: { equals: category, mode: 'insensitive' } } }
      ]
    });
  }
  const subcategory = String(query.subcategoryId ?? query.subcategory ?? '').trim();
  if (subcategory) {
    conditions.push({
      OR: [
        { subcategoryId: subcategory },
        { subcategory: { name: { equals: subcategory, mode: 'insensitive' } } }
      ]
    });
  }
  const condition = String(query.condition ?? '').toUpperCase();
  if (['NEW', 'RENEWED', 'USED'].includes(condition)) {
    conditions.push({ condition: condition as Prisma.EnumConditionFilter });
  }
  const color = String(query.color ?? '').trim();
  if (color) conditions.push({ availableColors: { has: color } });
  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);
  if (Number.isFinite(minPrice)) conditions.push({ basePrice: { gte: minPrice } });
  if (Number.isFinite(maxPrice)) conditions.push({ basePrice: { lte: maxPrice } });
  if (String(query.inStock) === 'true') conditions.push({ stockStatus: StockStatus.AVAILABLE });
  if (String(query.hasDiscount) === 'true') conditions.push({ discountValue: { gt: 0 } });
  return { AND: conditions };
};

const getOrderBy = (sort: unknown): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case 'price-asc':
      return { basePrice: 'asc' };
    case 'price-desc':
      return { basePrice: 'desc' };
    case 'name-asc':
      return { name: 'asc' };
    case 'name-desc':
      return { name: 'desc' };
    case 'discount-desc':
      return { discountValue: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
};

const getPublicProducts = async (query: Query = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, 20, 100);
  const where = publicWhere(query);
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: productInclude,
      orderBy: getOrderBy(query.sort)
    }),
    prisma.product.count({ where })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) }
  };
};

const getPublicProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true, category: { isActive: true } },
    include: productInclude
  });
  if (!product) throw new AppError(404, 'Product not found');
  return product;
};

const getRelatedProducts = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: { id: true, categoryId: true, subcategoryId: true, tags: true }
  });
  if (!product) throw new AppError(404, 'Product not found');
  return prisma.product.findMany({
    where: {
      id: { not: product.id },
      isActive: true,
      category: { isActive: true },
      OR: [
        ...(product.subcategoryId ? [{ subcategoryId: product.subcategoryId }] : []),
        { categoryId: product.categoryId },
        ...(product.tags.length ? [{ tags: { hasSome: product.tags } }] : [])
      ]
    },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: 8
  });
};

const getPublicFacets = async () => {
  const where: Prisma.ProductWhereInput = { isActive: true, category: { isActive: true } };
  const [categories, vendors, price, colors] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, products: { some: { isActive: true } } },
      include: {
        subcategories: {
          where: { products: { some: { isActive: true } } },
          orderBy: { name: 'asc' }
        },
        _count: { select: { products: { where: { isActive: true } } } }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.user.findMany({
      where: { role: 'VENDOR', products: { some: { isActive: true } } },
      select: { id: true, name: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    }),
    prisma.product.aggregate({ where, _min: { basePrice: true }, _max: { basePrice: true } }),
    prisma.product.findMany({ where, select: { availableColors: true } })
  ]);
  return {
    categories,
    vendors,
    price: { min: price._min.basePrice ?? 0, max: price._max.basePrice ?? 0 },
    colors: [...new Set(colors.flatMap((item) => item.availableColors))].sort(),
    conditions: ['NEW', 'RENEWED', 'USED']
  };
};

const adminWhere = (query: Query): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [];
  const search = String(query.search ?? query.searchTerm ?? '').trim();
  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    });
  }
  if (query.categoryId) conditions.push({ categoryId: String(query.categoryId) });
  if (query.status && query.status !== 'All') {
    const status = String(query.status).toLowerCase();
    if (status === 'active') conditions.push({ isActive: true });
    else if (status === 'inactive') conditions.push({ isActive: false });
    else if (status.includes('out')) conditions.push({ stockStatus: StockStatus.OUT_OF_STOCK });
    else if (status.includes('available')) conditions.push({ stockStatus: StockStatus.AVAILABLE });
  }
  return conditions.length > 0 ? { AND: conditions } : {};
};

const getAdminProducts = async (query: Query = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, 10, 100);
  const where = adminWhere(query);
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: productInclude,
      orderBy: getOrderBy(query.sort)
    }),
    prisma.product.count({ where })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) }
  };
};

const vendorWhere = (vendorId: string, query: Query): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [{ vendorId }];
  const search = String(query.search ?? query.searchTerm ?? '').trim();
  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    });
  }
  if (query.categoryId) conditions.push({ categoryId: String(query.categoryId) });
  if (query.status && query.status !== 'All') {
    const status = String(query.status).toLowerCase();
    if (status === 'active') conditions.push({ isActive: true });
    else if (status === 'inactive') conditions.push({ isActive: false });
    else if (status.includes('out')) conditions.push({ stockStatus: StockStatus.OUT_OF_STOCK });
    else if (status.includes('available')) conditions.push({ stockStatus: StockStatus.AVAILABLE });
  }
  return { AND: conditions };
};

const getVendorProducts = async (vendorId: string, query: Query = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, 10, 100);
  const where = vendorWhere(vendorId, query);
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: productInclude,
      orderBy: getOrderBy(query.sort)
    }),
    prisma.product.count({ where })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) }
  };
};

const getVendorStats = async (vendorId?: string) => {
  const where = vendorId ? { vendorId } : {};
  const [total, active, inactive, inStock, outOfStock, lowStock] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.count({ where: { ...where, isActive: true } }),
    prisma.product.count({ where: { ...where, isActive: false } }),
    prisma.product.count({ where: { ...where, stockStatus: StockStatus.AVAILABLE } }),
    prisma.product.count({ where: { ...where, stockStatus: StockStatus.OUT_OF_STOCK } }),
    vendorId
      ? prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint AS count
          FROM "products"
          WHERE "vendorId" = ${vendorId}
            AND "stockQuantity" > 0
            AND "stockQuantity" <= "lowStockAlertQuantity"
        `
      : prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint AS count
          FROM "products"
          WHERE "stockQuantity" > 0
            AND "stockQuantity" <= "lowStockAlertQuantity"
        `
  ]);
  return {
    total,
    active,
    inactive,
    inStock,
    outOfStock,
    lowStock: Number(lowStock[0]?.count ?? 0)
  };
};

const getVendorProductById = async (vendorId: string, id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, vendorId },
    include: productInclude
  });
  if (!product) throw new AppError(404, 'Product not found');
  return product;
};

const updateProduct = async (vendorId: string, id: string, rawPayload: ProductPayload) => {
  await getVendorProductById(vendorId, id);
  const payload = normalizePayload(rawPayload);
  await Promise.all([assertReferences(payload), assertUniqueSkus(payload, id)]);
  const slug = payload.name ? await createUniqueSlug(payload.name, id) : undefined;
  return prisma.$transaction(async (tx) => {
    if (payload.variants) await tx.productVariant.deleteMany({ where: { productId: id } });
    if (payload.specifications) {
      await tx.productSpecification.deleteMany({ where: { productId: id } });
    }
    return tx.product.update({
      where: { id },
      data: {
        ...(relationSafeData(payload) as unknown as Prisma.ProductUncheckedUpdateInput),
        ...(slug ? { slug } : {}),
        ...(payload.variants ? { variants: { create: payload.variants } } : {}),
        ...(payload.specifications ? { specifications: { create: payload.specifications } } : {})
      },
      include: productInclude
    });
  });
};

const updateProductStatus = async (vendorId: string, id: string, isActive: boolean) => {
  await getVendorProductById(vendorId, id);
  return prisma.product.update({ where: { id }, data: { isActive }, include: productInclude });
};

type ProductPromotionPayload = {
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  dealBadgeText?: string;
  dealStartDate?: string;
  dealEndDate?: string;
};

const updateProductPromotion = async (
  vendorId: string,
  id: string,
  payload: ProductPromotionPayload
) => {
  const product = await getVendorProductById(vendorId, id);
  const basePrice = Number(product.basePrice);
  if (payload.discountType === 'FIXED' && payload.discountValue > basePrice) {
    throw new AppError(400, 'Fixed discount cannot exceed the product price');
  }

  return prisma.product.update({
    where: { id },
    data: {
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      dealBadgeText: payload.dealBadgeText?.trim() || null,
      dealStartDate: payload.dealStartDate ? new Date(payload.dealStartDate) : null,
      dealEndDate: payload.dealEndDate ? new Date(payload.dealEndDate) : null
    },
    include: productInclude
  });
};

const removeProductPromotion = async (vendorId: string, id: string) => {
  await getVendorProductById(vendorId, id);
  return prisma.product.update({
    where: { id },
    data: {
      discountType: null,
      discountValue: null,
      dealBadgeText: null,
      dealStartDate: null,
      dealEndDate: null
    },
    include: productInclude
  });
};

const deleteProduct = async (vendorId: string, id: string) => {
  await getVendorProductById(vendorId, id);
  return prisma.product.delete({ where: { id } });
};

export const ProductService = {
  createProduct,
  getPublicProducts,
  getPublicFacets,
  getPublicProductBySlug,
  getRelatedProducts,
  getAdminProducts,
  getVendorProducts,
  getVendorStats,
  getVendorProductById,
  updateProduct,
  updateProductStatus,
  updateProductPromotion,
  removeProductPromotion,
  deleteProduct
};
