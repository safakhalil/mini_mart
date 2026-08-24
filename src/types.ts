export type CategoryId =
  | 'snacks'
  | 'beverages'
  | 'fresh-food'
  | 'groceries'
  | 'dairy'
  | 'frozen-food'
  | 'bakery'
  | 'personal-care'
  | 'household'
  | 'baby-care'
  | 'pet-supplies'
  | 'health-wellness';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
  badge?: string;
}

export interface NutritionInfo {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  sugar?: string;
  sodium?: string;
  fiber?: string;
  potassium?: string;
  servingSize?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount?: number;
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  email: string;
  phone?: string;
  createdAt: string;
  notified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: CategoryId;
  categoryName: string;
  description: string;
  sizeWeight: string;
  unit: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  discountPercent?: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  barcode?: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  images: string[];
  isFeatured?: boolean;
  isDailyEssential?: boolean;
  isDealOfTheDay?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  ingredients?: string;
  nutrition?: NutritionInfo;
  specifications?: Record<string, string>;
  status?: 'active' | 'draft' | 'out_of_stock';
  createdAt?: string;
  salesCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'placed'
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'out_of_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'credit_card'
  | 'cash_on_delivery'
  | 'digital_wallet';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  aptSuite?: string;
  city: string;
  postalCode: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  sizeWeight: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryTime: string;
  driverName?: string;
  driverPhone?: string;
  timeline: OrderTimelineEvent[];
}

export interface StoreAnalytics {
  totalRevenue: number;
  revenueGrowthPercent: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  totalCustomersCount: number;
  todayOrdersCount: number;
  lowStockCount: number;
  pendingOrdersCount: number;
}

export interface Promotion {
  id: string;
  name: string;
  title?: string;
  code: string;
  discountType: 'percentage' | 'percent' | 'fixed' | 'free_delivery';
  discountValue: number;
  minOrderAmount: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  usageCount?: number;
  status: 'active' | 'inactive' | 'expired';
  isActive?: boolean;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  ordersCount: number;
  totalOrders?: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'blocked';
  joinedDate: string;
  createdAt?: string;
  savedAddresses: DeliveryAddress[];
  address?: DeliveryAddress;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  status: 'OPEN_24_7' | 'CLOSED_TEMPORARILY' | 'LIMITED_HOURS';
  supportPhone: string;
  supportEmail: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxRatePercent: number;
  estimatedDeliveryMinMinutes: number;
  estimatedDeliveryMaxMinutes: number;
  currencySymbol: string;
  announcementText: string;
  isOpen24Hours?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'delivery' | 'payments' | 'orders' | 'returns' | 'quality';
}

export type ThemeMode = 'light' | 'dark';

export interface FilterState {
  search: string;
  category: CategoryId | 'all';
  minPrice: number;
  maxPrice: number;
  availability: 'all' | 'in_stock' | 'on_sale';
  brand: string[];
  minRating: number;
  hasDiscount: boolean;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
}
