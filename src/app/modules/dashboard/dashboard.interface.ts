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
