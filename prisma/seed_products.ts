import prisma from '../src/app/utils/prisma';

async function seedProducts() {
  console.log('Seeding sample products...');

  const category = await prisma.category.findFirst();
  const categoryId = category?.id || '53095387-ed73-470f-a084-d1632cf66d9c';

  const sampleProducts = [
    {
      sku: 'SKU-PLANT-MONSTERA-01',
      brand: 'Monstera Deliciosa Plant',
      productType: 'Indoor Plant',
      shortDescription: 'Beautiful Swiss Cheese Plant for indoor decoration.',
      categoryId,
      basePrice: 49.99,
      stockQuantity: 15,
      stockStatus: 'AVAILABLE' as const,
      thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Warehouse A',
      minDeliveryDays: 2,
      maxDeliveryDays: 5,
      lowStockAlertQuantity: 3,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
    },
    {
      sku: 'SKU-PLANT-FDL-02',
      brand: 'Fiddle Leaf Fig Tree',
      productType: 'Tree',
      shortDescription: 'Tall and elegant Ficus Lyrata for living rooms.',
      categoryId,
      basePrice: 89.99,
      stockQuantity: 8,
      stockStatus: 'AVAILABLE' as const,
      thumbnail: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Warehouse A',
      minDeliveryDays: 3,
      maxDeliveryDays: 7,
      lowStockAlertQuantity: 2,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
    },
    {
      sku: 'SKU-PLANT-SNAKE-03',
      brand: 'Sansevieria Snake Plant',
      productType: 'Indoor Plant',
      shortDescription: 'Air purifying indoor plant, low maintenance.',
      categoryId,
      basePrice: 24.99,
      stockQuantity: 0,
      stockStatus: 'OUT_OF_STOCK' as const,
      thumbnail: 'https://images.unsplash.com/photo-1599598425947-230a73445746?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Warehouse B',
      minDeliveryDays: 1,
      maxDeliveryDays: 3,
      lowStockAlertQuantity: 5,
      minOrderQuantity: 1,
      maxOrderQuantity: 20,
    },
    {
      sku: 'SKU-PLANT-POTHOS-04',
      brand: 'Golden Pothos Vine',
      productType: 'Hanging Plant',
      shortDescription: 'Cascading golden green vines, fast growing.',
      categoryId,
      basePrice: 19.99,
      stockQuantity: 45,
      stockStatus: 'AVAILABLE' as const,
      thumbnail: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Warehouse A',
      minDeliveryDays: 2,
      maxDeliveryDays: 4,
      lowStockAlertQuantity: 10,
      minOrderQuantity: 1,
      maxOrderQuantity: 15,
    },
    {
      sku: 'SKU-TECH-HEADPHONES-05',
      brand: 'Wireless Noise Canceling Headphones',
      productType: 'Audio',
      shortDescription: 'Premium over-ear Bluetooth headphones with deep bass.',
      categoryId,
      basePrice: 149.99,
      stockQuantity: 30,
      stockStatus: 'AVAILABLE' as const,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Tech Hub',
      minDeliveryDays: 2,
      maxDeliveryDays: 5,
      lowStockAlertQuantity: 5,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
    },
    {
      sku: 'SKU-TECH-WATCH-06',
      brand: 'Smart Fitness Watch Series 5',
      productType: 'Wearable',
      shortDescription: 'Track heart rate, steps, sleep, and workouts.',
      categoryId,
      basePrice: 199.99,
      stockQuantity: 12,
      stockStatus: 'AVAILABLE' as const,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
      shipsFrom: 'Tech Hub',
      minDeliveryDays: 1,
      maxDeliveryDays: 3,
      lowStockAlertQuantity: 3,
      minOrderQuantity: 1,
      maxOrderQuantity: 3,
    },
  ];

  for (const item of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: item,
      create: item,
    });
  }

  console.log('Sample products seeded successfully!');
}

seedProducts()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
