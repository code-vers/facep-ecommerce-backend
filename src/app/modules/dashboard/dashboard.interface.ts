export interface IOverviewMetrics {
  totalVendors: number;
  totalCustomers: number;
  totalRevenue: number;
  platformRevenue: number;
  vendorGrowth: string;
  customerGrowth: string;
  revenueGrowth: string;
  platformGrowth: string;
  currentPeriod: string;
}

export interface IOverviewAlerts {
  pendingStoresCount: number;
  pendingProductsCount: number;
  supportInquiriesCount: number;
}

export interface IRevenueChartPoint {
  name: string;
  value: number;
}

export interface ITopStoreItem {
  id: string;
  logo: string | null;
  store: string;
  vendor: string;
  sales: number;
  orders: number;
  products: number;
  rating: string;
}

export interface IPendingStoreItem {
  id: string;
  logo: string | null;
  store: string;
  vendor: string;
  email: string;
  date: string;
}

export interface IPendingProductItem {
  id: string;
  image: string;
  product: string;
  store: string;
  category: string;
  price: number;
}

export interface IAdminOverviewResponse {
  metrics: IOverviewMetrics;
  alerts: IOverviewAlerts;
  revenueOverview: IRevenueChartPoint[];
  topStores: ITopStoreItem[];
  pendingStores: IPendingStoreItem[];
  pendingProducts: IPendingProductItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendor Dashboard Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface IVendorOverviewMetrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  storeRating: string;
  salesGrowth: string;
  ordersGrowth: string;
  productsGrowth: string;
  ratingGrowth: string;
  currentPeriod: string;
}

export interface IRecentOrderItem {
  id: string;
  orderNumber: string;
  product: string;
  date: string;
  amount: number;
  status: string;
}

export interface ITopSellingProductItem {
  id: string;
  image: string;
  product: string;
  units: number;
  price: number;
}

export interface ILowStockAlert {
  lowStockCount: number;
}

export interface IVendorOverviewResponse {
  metrics: IVendorOverviewMetrics;
  revenueOverview: IRevenueChartPoint[];
  ordersTrend: IRevenueChartPoint[];
  recentOrders: IRecentOrderItem[];
  topSellingProducts: ITopSellingProductItem[];
  lowStockAlert: ILowStockAlert;
}
