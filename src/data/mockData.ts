import { Category, Product, Order, Promotion, Customer, StoreSettings, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_PROMOTIONS: Promotion[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: '24/7 Mart',
  tagline: 'Your Everyday Essentials. Anytime.',
  status: 'OPEN_24_7',
  supportPhone: '+1 (800) 247-MART',
  supportEmail: 'support@247mart.com',
  deliveryFee: 3.99,
  freeDeliveryThreshold: 35.00,
  taxRatePercent: 7.5,
  estimatedDeliveryMinMinutes: 25,
  estimatedDeliveryMaxMinutes: 35,
  currencySymbol: '$',
  announcementText: 'OPEN 24/7 • Fast Delivery in 25–35 Mins • Fresh Groceries & Essentials',
  isOpen24Hours: true,
  adminPin: '1234',
};

export const INITIAL_REVIEWS: Review[] = [];