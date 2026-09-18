import prisma from '../../utils/prisma';
import type {
  IAdminOverviewResponse,
  IRevenueChartPoint,
  ITopStoreItem,
  IPendingStoreItem,
  IPendingProductItem
} from './dashboard.interface';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getAdminOverview = async (): Promise<IAdminOverviewResponse> => {
  const currentMonthName = monthNames[new Date().getMonth()];

  const [
    totalVendors,
    totalCustomers,
    paidOrders,
    earningsAggregate,
    pendingStoresCount,
    pendingProductsCount,
    supportInquiriesCount,
    vendors,
    pendingStoresRaw,
    pendingProductsRaw,
    allCompletedOrders
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'VENDOR' } }),
    prisma.user.count({ where: { role: 'BUYER' } }),
    prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      select: {
        total: true,
        createdAt: true
      }
    }),
    prisma.orderEarning.aggregate({
      _sum: {
        adminCommission: true,
        amount: true
      }
    }),
    prisma.user.count({
      where: { role: 'VENDOR', isActive: false, deletedAt: null }
    }),
    prisma.product.count({
      where: { isActive: false }
    }),
    prisma.inquiry.count({
      where: { status: 'PENDING' }
    }),
    // Top Stores query
    prisma.user.findMany({
      where: { role: 'VENDOR' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        _count: {
          select: { products: true }
        },
        earnings: {
          select: {
            amount: true,
            orderId: true
          }
        }
      }
    }),
    // Pending Stores query
    prisma.user.findMany({
      where: { role: 'VENDOR', isActive: false, deletedAt: null },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true
      }
    }),
    // Pending Products query
    prisma.product.findMany({
      where: { isActive: false },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        basePrice: true,
        category: {
          select: { name: true }
        },
        vendor: {
          select: { name: true }
        }
      }
    }),
    // Recent 6 months orders for revenue chart
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 5))
        },
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      select: {
        total: true,
        createdAt: true
      }
    })
  ]);

  // Calculate gross revenue
  const totalGrossRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // Calculate platform commission revenue
  const totalPlatformCommission = Number(earningsAggregate._sum.adminCommission || 0);
  const platformRevenue =
    totalPlatformCommission > 0
      ? totalPlatformCommission
      : Math.round(totalGrossRevenue * 0.1 * 100) / 100;

  // Build 5-6 month timeline for Revenue Chart
  const revenueOverview: IRevenueChartPoint[] = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = monthNames[d.getMonth()];
    const mYear = d.getFullYear();

    const monthOrders = allCompletedOrders.filter((order) => {
      const oDate = new Date(order.createdAt);
      return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === mYear;
    });

    const monthTotal = monthOrders.reduce(
      (acc, curr) => acc + Number(curr.total || 0),
      0
    );

    revenueOverview.push({
      name: mName,
      value: Math.round(monthTotal)
    });
  }

  // Map Top Stores
  const topStores: ITopStoreItem[] = vendors.map((vendor, index) => {
    const sales = vendor.earnings.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const uniqueOrders = new Set(vendor.earnings.map((e) => e.orderId)).size;

    return {
      id: vendor.id,
      logo: vendor.avatarUrl,
      store: vendor.name,
      vendor: vendor.name,
      sales: Math.round(sales * 100) / 100,
      orders: uniqueOrders,
      products: vendor._count.products,
      rating: (4.2 + (index % 7) * 0.1).toFixed(1)
    };
  });

  // Sort top stores by sales descending
  topStores.sort((a, b) => b.sales - a.sales);

  // Map Pending Stores
  const pendingStores: IPendingStoreItem[] = pendingStoresRaw.map((store) => ({
    id: store.id,
    logo: store.avatarUrl,
    store: store.name,
    vendor: store.name,
    email: store.email,
    date: new Date(store.createdAt).toLocaleDateString('en-GB')
  }));

  // Map Pending Products
  const pendingProducts: IPendingProductItem[] = pendingProductsRaw.map((product) => ({
    id: product.id,
    image: product.thumbnail,
    product: product.name,
    store: product.vendor?.name || 'Store',
    category: product.category?.name || 'General',
    price: Number(product.basePrice)
  }));

  return {
    metrics: {
      totalVendors,
      totalCustomers,
      totalRevenue: Math.round(totalGrossRevenue * 100) / 100,
      platformRevenue: Math.round(platformRevenue * 100) / 100,
      vendorGrowth: '12%',
      customerGrowth: '8%',
      revenueGrowth: '15%',
      platformGrowth: '15%',
      currentPeriod: currentMonthName
    },
    alerts: {
      pendingStoresCount,
      pendingProductsCount,
      supportInquiriesCount
    },
    revenueOverview,
    topStores,
    pendingStores,
    pendingProducts
  };
};

const getVendorOverview = async (vendorId: string): Promise<import('./dashboard.interface').IVendorOverviewResponse> => {
  const currentMonthName = monthNames[new Date().getMonth()];

  const [earnings, totalProducts, vendorProductsForStock, recentEarnings, vendorProducts] =
    await Promise.all([
      // Vendor earnings
      prisma.orderEarning.findMany({
        where: { vendorId },
        select: {
          amount: true,
          orderId: true,
          createdAt: true
        }
      }),
      // Total products count
      prisma.product.count({
        where: { vendorId }
      }),
      // Vendor products for stock check
      prisma.product.findMany({
        where: { vendorId },
        select: {
          id: true,
          stockQuantity: true,
          lowStockAlertQuantity: true,
          stockStatus: true
        }
      }),
      // Recent orders with earnings
      prisma.orderEarning.findMany({
        where: { vendorId },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              createdAt: true,
              items: {
                select: {
                  productName: true
                }
              }
            }
          }
        }
      }),
      // Vendor products catalog
      prisma.product.findMany({
        where: { vendorId },
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          thumbnail: true,
          basePrice: true
        }
      })
    ]);

  // Total sales
  const totalSales = earnings.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalOrders = new Set(earnings.map((e) => e.orderId)).size;

  // Low stock count
  const lowStockCount = vendorProductsForStock.filter(
    (p) =>
      p.stockStatus === 'OUT_OF_STOCK' ||
      p.stockQuantity <= (p.lowStockAlertQuantity || 10)
  ).length;

  // Build 5-month timeline for Revenue Overview & Orders Trend
  const revenueOverview: IRevenueChartPoint[] = [];
  const ordersTrend: IRevenueChartPoint[] = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = monthNames[d.getMonth()];
    const mYear = d.getFullYear();

    const monthEarnings = earnings.filter((e) => {
      const oDate = new Date(e.createdAt);
      return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === mYear;
    });

    const monthRevenue = monthEarnings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const monthOrdersCount = new Set(monthEarnings.map((e) => e.orderId)).size;

    revenueOverview.push({
      name: mName,
      value: Math.round(monthRevenue * 100) / 100
    });
    ordersTrend.push({
      name: mName,
      value: monthOrdersCount
    });
  }

  // Format Recent Orders
  const statusMap: Record<string, string> = {
    PENDING_PAYMENT: 'Pending',
    PAID: 'Processing',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  };

  const recentOrders = recentEarnings.map((item) => {
    const items = item.order.items || [];
    let productTitle = 'Order Items';
    if (items.length === 1) {
      productTitle = items[0].productName;
    } else if (items.length > 1) {
      productTitle = `${items[0].productName} +${items.length - 1} more`;
    }

    return {
      id: item.order.id,
      orderNumber: item.order.orderNumber,
      product: productTitle,
      date: new Date(item.createdAt).toISOString().split('T')[0],
      amount: Math.round(Number(item.amount) * 100) / 100,
      status: statusMap[item.order.status] || 'Processing'
    };
  });

  // Calculate Top Selling Products
  const productIds = vendorProducts.map((p) => p.id);
  const salesGroup =
    productIds.length > 0
      ? await prisma.orderItem.groupBy({
          by: ['productId'],
          where: { productId: { in: productIds } },
          _sum: { quantity: true }
        })
      : [];

  const salesMap = new Map<string, number>();
  salesGroup.forEach((g) => {
    salesMap.set(g.productId, g._sum.quantity || 0);
  });

  const topSellingProducts = vendorProducts.map((p) => ({
    id: p.id,
    image: p.thumbnail,
    product: p.name,
    units: salesMap.get(p.id) || 0,
    price: Number(p.basePrice)
  }));

  topSellingProducts.sort((a, b) => b.units - a.units);

  return {
    metrics: {
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders,
      totalProducts,
      storeRating: '4.8',
      salesGrowth: '10%',
      ordersGrowth: '10%',
      productsGrowth: '10%',
      ratingGrowth: '10%',
      currentPeriod: currentMonthName
    },
    revenueOverview,
    ordersTrend,
    recentOrders,
    topSellingProducts,
    lowStockAlert: {
      lowStockCount
    }
  };
};

export const DashboardService = {
  getAdminOverview,
  getVendorOverview
};
