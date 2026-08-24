import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Promotion,
  Customer,
  StoreSettings,
  OrderStatus,
  DeliveryAddress,
  Review,
  StoreAnalytics,
  ThemeMode,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_PROMOTIONS,
  INITIAL_CUSTOMERS,
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: DeliveryAddress;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentOrder: Order | null;
  storeSettings: StoreSettings;
  activePromo: Promotion | null;
  promoDiscount: number;
  appliedPromoCode: string;
  selectedLocation: { label: string; address: string };
  user: UserProfile;
  adminUser: AdminUser | null;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isLocationModalOpen: boolean;
  quickViewProduct: Product | null;
  toasts: Toast[];
  isLoading: boolean;
  
  // Analytics & Admin Entities
  analytics: StoreAnalytics;
  customers: Customer[];
  promotions: Promotion[];
  addPromotion: (promo: Partial<Promotion>) => Promise<Promotion>;
  togglePromotion: (id: string) => Promise<void>;
  restockProduct: (productId: string, amount?: number) => Promise<void>;

  // Theme Management
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

  // Comparison Feature
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Modal states for Receipt & Back-in-Stock
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  receiptOrder: Order | null;
  setReceiptOrder: (order: Order | null) => void;
  openReceiptModal: (order: Order) => void;

  isBackInStockModalOpen: boolean;
  setIsBackInStockModalOpen: (open: boolean) => void;
  backInStockProduct: Product | null;
  setBackInStockProduct: (prod: Product | null) => void;
  openBackInStockModal: (product: Product) => void;

  // Reviews & Stock Notifications
  addProductReview: (productId: string, review: { rating: number; comment: string; userName?: string }) => Promise<Review>;
  requestBackInStock: (productId: string, email: string, phone?: string) => Promise<boolean>;

  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartQuantity: (productId: string) => number;
  cartSubtotal: number;
  cartTotal: number;
  deliveryFee: number;
  cartCount: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  placeOrder: (orderData: {
    deliveryAddress: DeliveryAddress;
    paymentMethod: 'credit_card' | 'cash_on_delivery' | 'digital_wallet';
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  reorder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;

  // UI state setters
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSelectedLocation: (loc: { label: string; address: string }) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setUser: (user: UserProfile) => void;

  // Admin Actions
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  adminLogout: () => void;
  addProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_USER: UserProfile = {
  id: 'cust-01',
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 234-5678',
  address: {
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    streetAddress: '742 Evergreen Terrace',
    aptSuite: 'Apt 4B',
    city: 'Springfield',
    postalCode: '97477',
    deliveryInstructions: 'Ring doorbell twice. Leave near doorstep.',
    isDefault: true,
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  
  // Local persistent state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('247mart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('247mart_wishlist');
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-09'];
    } catch {
      return ['prod-01', 'prod-09'];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(INITIAL_ORDERS[0] || null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [activePromo, setActivePromo] = useState<Promotion | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('247mart_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('247mart_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedLocation, setSelectedLocation] = useState<{ label: string; address: string }>({
    label: 'Home • 742 Evergreen Terr',
    address: '742 Evergreen Terrace, Apt 4B, Springfield, 97477',
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Theme Mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('247mart_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Sync theme with HTML root class
  useEffect(() => {
    try {
      localStorage.setItem('247mart_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Product Comparison State (up to 4 items)
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('247mart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('247mart_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [compareList]);

  const addToCompare = useCallback((product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        showToast(`${product.name} is already in comparison`, 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('You can compare a maximum of 4 products at once', 'info');
        return prev;
      }
      showToast(`Added ${product.name} to comparison`, 'success');
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed item from comparison', 'info');
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison list cleared', 'info');
  }, []);

  const isInCompare = useCallback((productId: string) => {
    return compareList.some((p) => p.id === productId);
  }, [compareList]);

  // Modal States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isBackInStockModalOpen, setIsBackInStockModalOpen] = useState(false);
  const [backInStockProduct, setBackInStockProduct] = useState<Product | null>(null);

  const openReceiptModal = useCallback((order: Order) => {
    setReceiptOrder(order);
    setIsReceiptModalOpen(true);
  }, []);

  const openBackInStockModal = useCallback((product: Product) => {
    setBackInStockProduct(product);
    setIsBackInStockModalOpen(true);
  }, []);

  // Product Reviews Action
  const addProductReview = async (
    productId: string,
    reviewData: { rating: number; comment: string; userName?: string }
  ): Promise<Review> => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: reviewData.userName || user.name || 'Verified Customer',
      rating: reviewData.rating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment,
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const saved = await res.json();
        // Update local product rating and reviews list
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === productId) {
              const currentReviews = p.reviews || [];
              const updatedReviews = [saved, ...currentReviews];
              const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
              return {
                ...p,
                rating: Number(avg.toFixed(1)),
                reviewCount: updatedReviews.length,
                reviews: updatedReviews,
              };
            }
            return p;
          })
        );
        showToast('Review submitted successfully! Thank you.', 'success');
        return saved;
      }
    } catch (e) {
      console.error('Review submit fallback', e);
    }

    // Local fallback update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: updatedReviews.length,
            reviews: updatedReviews,
          };
        }
        return p;
      })
    );
    showToast('Review submitted successfully! Thank you.', 'success');
    return newReview;
  };

  // Back In Stock Notification Action
  const requestBackInStock = async (
    productId: string,
    email: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/back-in-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, phone }),
      });
      if (res.ok) {
        showToast(`Stock alert registered for ${email}! We'll notify you promptly.`, 'success');
        return true;
      }
    } catch (e) {
      console.error('Back in stock submit fallback', e);
    }
    showToast(`Stock alert registered for ${email}! We'll notify you promptly.`, 'success');
    return true;
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('247mart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('247mart_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('247mart_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem('247mart_admin', JSON.stringify(adminUser));
      } else {
        localStorage.removeItem('247mart_admin');
      }
    } catch (e) {
      console.error(e);
    }
  }, [adminUser]);

  // Toast System
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data from server APIs
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [prodsRes, catsRes, ordersRes, settingsRes, promosRes, custsRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/orders').catch(() => null),
        fetch('/api/settings').catch(() => null),
        fetch('/api/promotions').catch(() => null),
        fetch('/api/customers').catch(() => null),
      ]);

      if (prodsRes && prodsRes.ok) {
        const prods = await prodsRes.json();
        setProducts(prods);
      }
      if (catsRes && catsRes.ok) {
        const cats = await catsRes.json();
        setCategories(cats);
      }
      if (ordersRes && ordersRes.ok) {
        const ords = await ordersRes.json();
        setOrders(ords);
        if (ords.length > 0 && !currentOrder) {
          setCurrentOrder(ords[0]);
        }
      }
      if (settingsRes && settingsRes.ok) {
        const sets = await settingsRes.json();
        setStoreSettings(sets);
      }
      if (promosRes && promosRes.ok) {
        const pms = await promosRes.json();
        setPromotions(pms);
      }
      if (custsRes && custsRes.ok) {
        const csts = await custsRes.json();
        setCustomers(csts);
      }
    } catch (err) {
      console.error('Failed to load live server data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cart Helpers
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });

    showToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode('');
    setActivePromo(null);
    setPromoDiscount(0);
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = cartSubtotal >= storeSettings.freeDeliveryThreshold;
  const deliveryFee = cartSubtotal === 0 ? 0 : (isFreeDelivery ? 0 : storeSettings.deliveryFee);
  const tax = Number((cartSubtotal * (storeSettings.taxRatePercent / 100)).toFixed(2));
  const cartTotal = Math.max(0, Number((cartSubtotal - promoDiscount + deliveryFee + tax).toFixed(2)));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo codes
  const applyPromoCode = async (code: string) => {
    try {
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromoCode(data.promo.code);
        setActivePromo(data.promo);
        setPromoDiscount(data.discountAmount);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid promo code', 'error');
        return { success: false, message: data.message || 'Invalid promo code' };
      }
    } catch {
      // Fallback local promo validation if offline
      if (code.toUpperCase() === 'MART24' && cartSubtotal >= 20) {
        const disc = Number((cartSubtotal * 0.2).toFixed(2));
        setAppliedPromoCode('MART24');
        setPromoDiscount(disc);
        showToast('Coupon "MART24" applied (20% OFF)!', 'success');
        return { success: true, message: '20% OFF applied!' };
      }
      showToast('Could not validate coupon', 'error');
      return { success: false, message: 'Could not validate coupon' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode('');
    setActivePromo(null);
    setPromoDiscount(0);
    showToast('Promo code removed', 'info');
  };

  // Place Order
  const placeOrder = async (orderData: {
    deliveryAddress: DeliveryAddress;
    paymentMethod: 'credit_card' | 'cash_on_delivery' | 'digital_wallet';
  }): Promise<Order> => {
    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      sizeWeight: item.product.sizeWeight,
    }));

    const payload = {
      customerName: orderData.deliveryAddress.fullName || user.name,
      customerEmail: user.email,
      customerPhone: orderData.deliveryAddress.phone || user.phone,
      items,
      subtotal: cartSubtotal,
      discount: promoDiscount,
      promoCode: appliedPromoCode || undefined,
      deliveryFee,
      tax,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      deliveryAddress: orderData.deliveryAddress,
    };

    let createdOrder: Order;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        createdOrder = await res.json();
      } else {
        throw new Error('Failed to create order on server');
      }
    } catch {
      // Fallback
      createdOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `#247M-${orders.length + 10246}`,
        createdAt: new Date().toISOString(),
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        items,
        subtotal: cartSubtotal,
        discount: promoDiscount,
        promoCode: appliedPromoCode,
        deliveryFee,
        tax,
        total: cartTotal,
        status: 'pending',
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        deliveryAddress: payload.deliveryAddress,
        estimatedDeliveryTime: '25-35 mins',
        driverName: 'Samir Patel',
        driverPhone: '+1 (555) 789-0123',
        timeline: [
          {
            status: 'pending',
            label: 'Order Received',
            timestamp: 'Just now',
            completed: true,
            description: 'Order placed & payment verified.',
          },
          {
            status: 'confirmed',
            label: 'Order Confirmed',
            timestamp: 'Expected in 2 mins',
            completed: false,
            description: 'Store confirmed order packing.',
          },
          {
            status: 'preparing',
            label: 'Packing Items',
            timestamp: 'Expected in 8 mins',
            completed: false,
            description: 'Store associate preparing insulated bags.',
          },
          {
            status: 'out_of_delivery',
            label: 'Out for Delivery',
            timestamp: 'Expected in 18 mins',
            completed: false,
            description: 'Courier en route to your address.',
          },
          {
            status: 'delivered',
            label: 'Delivered',
            timestamp: 'Expected in 30 mins',
            completed: false,
            description: 'Order handed over safely.',
          },
        ],
      };
    }

    setOrders((prev) => [createdOrder, ...prev]);
    setCurrentOrder(createdOrder);
    clearCart();
    showToast(`Order ${createdOrder.orderNumber} placed successfully!`, 'success');
    return createdOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(updated);
        }
        showToast(`Order status updated to: ${status.replace('_', ' ').toUpperCase()}`, 'info');
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product && product.stock > 0) {
        addToCart(product, item.quantity);
      }
    });
    setIsCartOpen(true);
    showToast('Items added to cart from previous order', 'success');
  };

  // Admin Functions
  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        showToast('Welcome back, Store Admin!', 'success');
        return true;
      }
    } catch {
      if (email === 'admin@247mart.com' && pass === 'admin123') {
        const adm: AdminUser = {
          id: 'adm-01',
          name: 'Store Manager',
          email: 'admin@247mart.com',
          role: 'ADMIN',
        };
        setAdminUser(adm);
        showToast('Welcome back, Store Admin!', 'success');
        return true;
      }
    }
    showToast('Invalid credentials. Use admin@247mart.com / admin123', 'error');
    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    showToast('Logged out of Admin Portal', 'info');
  };

  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      showToast(`Product "${created.name}" created!`, 'success');
      return created;
    }
    throw new Error('Failed to add product');
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Product "${updated.name}" updated!`, 'success');
      return updated;
    }
    throw new Error('Failed to update product');
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product deleted', 'info');
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    const res = await fetch(`/api/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Inventory updated to ${newStock} units`, 'success');
    }
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    if (res.ok) {
      const updated = await res.json();
      setStoreSettings(updated);
      showToast('Store settings updated!', 'success');
    }
  };

  const restockProduct = async (productId: string, amount = 20) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const newStock = target.stock + amount;
    await updateStock(productId, newStock);
    showToast(`Restocked ${target.name} (+${amount} units)`, 'success');
  };

  const addPromotion = async (promoData: Partial<Promotion>): Promise<Promotion> => {
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      name: promoData.title || promoData.name || promoData.code || 'Promotion',
      title: promoData.title || promoData.name || promoData.code || 'Promotion',
      code: (promoData.code || '').toUpperCase(),
      discountType: (promoData.discountType === 'percent' ? 'percentage' : promoData.discountType) as any || 'percentage',
      discountValue: Number(promoData.discountValue) || 10,
      minOrderAmount: Number(promoData.minSpend || promoData.minOrderAmount) || 0,
      minSpend: Number(promoData.minSpend || promoData.minOrderAmount) || 0,
      startDate: promoData.startDate || new Date().toISOString().split('T')[0],
      endDate: promoData.validUntil || promoData.endDate || '2026-12-31',
      validUntil: promoData.validUntil || promoData.endDate || '2026-12-31',
      usageLimit: promoData.usageLimit || 1000,
      usedCount: 0,
      usageCount: 0,
      status: promoData.isActive === false ? 'inactive' : 'active',
      isActive: promoData.isActive !== false,
      description: promoData.description || '',
    };

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo),
      });
      if (res.ok) {
        const created = await res.json();
        setPromotions((prev) => [created, ...prev]);
        showToast(`Promotion "${newPromo.code}" added!`, 'success');
        return created;
      }
    } catch {
      // local fallback
    }

    setPromotions((prev) => [newPromo, ...prev]);
    showToast(`Promotion "${newPromo.code}" added!`, 'success');
    return newPromo;
  };

  const togglePromotion = async (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextActive = !(p.isActive !== undefined ? p.isActive : p.status === 'active');
          return {
            ...p,
            isActive: nextActive,
            status: nextActive ? 'active' : 'inactive',
          };
        }
        return p;
      })
    );
    showToast('Promotion status toggled', 'info');
  };

  const analytics: StoreAnalytics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const orderSum = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    // Realistic 24/7 store baseline aggregated metrics
    const totalRevenue = orderSum > 0 ? orderSum + 34820.5 : 34850.75;
    const totalOrdersCount = orders.length > 0 ? orders.length + 138 : 142;
    const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 28.5;
    const totalCustomersCount = customers.length > 0 ? customers.length : 3;
    const pendingOrdersCount = orders.filter((o) =>
      ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'pending'].includes(o.status)
    ).length;
    const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      revenueGrowthPercent: 24.6,
      totalOrdersCount,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      totalCustomersCount,
      todayOrdersCount: 28,
      lowStockCount,
      pendingOrdersCount,
    };
  }, [orders, products, customers]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        customers,
        promotions,
        analytics,
        currentOrder,
        storeSettings,
        activePromo,
        promoDiscount,
        appliedPromoCode,
        selectedLocation,
        user,
        adminUser,
        isCartOpen,
        isSearchOpen,
        isLocationModalOpen,
        quickViewProduct,
        toasts,
        isLoading,
        theme,
        toggleTheme,
        setTheme,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        receiptOrder,
        setReceiptOrder,
        openReceiptModal,
        isBackInStockModalOpen,
        setIsBackInStockModalOpen,
        backInStockProduct,
        setBackInStockProduct,
        openBackInStockModal,
        addProductReview,
        requestBackInStock,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartQuantity,
        cartSubtotal,
        cartTotal,
        deliveryFee,
        cartCount,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        updateOrderStatus,
        reorder,
        setCurrentOrder,
        setIsCartOpen,
        setIsSearchOpen,
        setIsLocationModalOpen,
        setQuickViewProduct,
        setSelectedLocation,
        showToast,
        removeToast,
        setUser,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        restockProduct,
        addPromotion,
        togglePromotion,
        updateStoreSettings,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
