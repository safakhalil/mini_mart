import { supabase } from './supabase';
import { Product, Order, Promotion, Customer, StoreSettings, Review, Category } from '../types';

// Categories
export const db = {
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Calculate item counts dynamically
    const categoriesWithCount = await Promise.all(
      (data || []).map(async (cat) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)
          .eq('status', 'active');
        
        return {
          ...cat,
          itemCount: count || 0,
        };
      })
    );
    
    return categoriesWithCount;
  },

  async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Products
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    stockStatus?: string;
    sort?: string;
    featured?: boolean;
  }) {
    let query = supabase.from('products').select('*');

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.featured) {
      query = query.or('is_featured.eq.true,is_deal_of_the_day.eq.true,is_daily_essential.eq.true');
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,category_name.ilike.%${q}%`);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.stockStatus === 'in_stock') {
      query = query.gt('stock', 0);
    }

    const { data, error } = await query.eq('status', 'active');

    if (error) throw error;

    let filtered = data || [];

    // Client-side search for tags (since Supabase doesn't support JSONB array contains easily)
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((p) => 
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters?.sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters?.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters?.sort === 'popular') {
      filtered.sort((a, b) => b.sales_count - a.sales_count);
    } else if (filters?.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProduct(product: Partial<Product>) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      sales_count: 0,
      rating: 5.0,
      review_count: 0,
      images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'],
      tags: product.tags || [product.brand || 'Groceries'],
      status: product.status || 'active',
      ...product,
    };

    // Calculate discount percent if not provided
    if (newProduct.original_price && newProduct.original_price > newProduct.price) {
      newProduct.discount_percent = Math.round(
        ((newProduct.original_price - newProduct.price) / newProduct.original_price) * 100
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    if (updates.original_price && updates.original_price > updates.price) {
      updates.discount_percent = Math.round(
        ((updates.original_price - updates.price) / updates.original_price) * 100
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Product deleted successfully' };
  },

  async updateProductStock(id: string, stock: number) {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const updates: any = { stock, updated_at: new Date().toISOString() };
    if (stock <= 0) {
      updates.status = 'out_of_stock';
    } else if (product.status === 'out_of_stock') {
      updates.status = 'active';
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Orders
  async getOrders(filters?: { status?: string; email?: string }) {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.email) {
      query = query.ilike('customer_email', filters.email);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${id},order_number.eq.${id}`)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createOrder(order: Partial<Order>, storeSettings: StoreSettings) {
    const orderCount = await this.getOrderCount();
    const now = new Date();
    const estMin = storeSettings.estimatedDeliveryMinMinutes || 25;
    const estMax = storeSettings.estimatedDeliveryMaxMinutes || 35;

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: `#247M-${orderCount + 10246}`,
      created_at: now.toISOString(),
      status: 'pending',
      payment_status: order.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      estimated_delivery_time: `${estMin}-${estMax} mins`,
      driver_name: 'Samir Patel',
      driver_phone: '+1 (555) 789-0123',
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
          description: 'Store associate preparing bags.',
        },
        {
          status: 'out_of_delivery',
          label: 'Out for Delivery',
          timestamp: `Expected in ${estMin - 10} mins`,
          completed: false,
          description: 'Courier en route to your address.',
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: `Expected in ${estMin} mins`,
          completed: false,
          description: 'Order handed over safely.',
        },
      ],
      ...order,
    };

    // Deduct stock and increment sales count
    if (newOrder.items) {
      for (const item of newOrder.items) {
        const product = await this.getProductById(item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await this.updateProductStock(product.id, newStock);
          
          await supabase
            .from('products')
            .update({ 
              sales_count: (product.sales_count || 0) + item.quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);
        }
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;

    // Update or add customer record
    await this.updateOrCreateCustomer(newOrder);

    return data;
  },

  async getOrderCount() {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    return count || 0;
  },

  async updateOrderStatus(id: string, status: string) {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    const updates: any = { status, updated_at: new Date().toISOString() };

    // Update timeline step completions
    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_of_delivery', 'delivered'];
    const currentIdx = statusOrder.indexOf(status);

    const updatedTimeline = order.timeline.map((step: any) => {
      const stepIdx = statusOrder.indexOf(step.status);
      if (stepIdx <= currentIdx && currentIdx !== -1) {
        return { ...step, completed: true };
      }
      return step;
    });

    updates.timeline = updatedTimeline;

    if (status === 'delivered') {
      updates.payment_status = 'paid';
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrCreateCustomer(order: any) {
    const existingCust = await supabase
      .from('customers')
      .select('*')
      .ilike('email', order.customerEmail)
      .single();

    if (existingCust.data) {
      await supabase
        .from('customers')
        .update({
          orders_count: existingCust.data.orders_count + 1,
          total_spent: existingCust.data.total_spent + order.total,
          last_order_date: order.createdAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCust.data.id);
    } else {
      await supabase.from('customers').insert({
        id: `cust-${Date.now()}`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        orders_count: 1,
        total_spent: order.total,
        last_order_date: order.createdAt,
        status: 'active',
        joined_date: new Date().toISOString().split('T')[0],
        saved_addresses: [order.deliveryAddress],
      });
    }
  },

  // Promotions
  async getPromotions() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createPromotion(promotion: Partial<Promotion>) {
    const newPromotion = {
      id: `promo-${Date.now()}`,
      used_count: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      ...promotion,
    };

    const { data, error } = await supabase
      .from('promotions')
      .insert(newPromotion)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async validatePromotion(code: string, orderAmount: number, storeSettings: StoreSettings) {
    if (!code) {
      throw new Error('Please provide a coupon code');
    }

    const { data: promo, error } = await supabase
      .from('promotions')
      .select('*')
      .ilike('code', code.trim())
      .eq('status', 'active')
      .single();

    if (error || !promo) {
      throw new Error('Invalid or expired coupon code');
    }

    if (orderAmount < promo.min_order_amount) {
      throw new Error(`Minimum order amount of $${promo.min_order_amount.toFixed(2)} required for this coupon`);
    }

    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = (orderAmount * promo.discount_value) / 100;
      if (promo.max_discount && discountAmount > promo.max_discount) {
        discountAmount = promo.max_discount;
      }
    } else if (promo.discount_type === 'fixed') {
      discountAmount = Math.min(orderAmount, promo.discount_value);
    } else if (promo.discount_type === 'free_delivery') {
      discountAmount = storeSettings.deliveryFee;
    }

    return {
      valid: true,
      promo,
      discountAmount: Number(discountAmount.toFixed(2)),
      message: `Coupon "${promo.code}" applied successfully!`,
    };
  },

  // Customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Reviews
  async getReviews(productId?: string) {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createReview(review: Partial<Review>) {
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified_purchase: true,
      created_at: new Date().toISOString(),
      ...review,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(newReview)
      .select()
      .single();

    if (error) throw error;

    // Update product rating
    const prod = await this.getProductById(newReview.product_id);
    if (prod) {
      const { data: prodReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', prod.id);

      if (prodReviews) {
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        await supabase
          .from('products')
          .update({
            rating: Number(avg.toFixed(1)),
            review_count: prodReviews.length,
            updated_at: new Date().toISOString(),
          })
          .eq('id', prod.id);
      }
    }

    return data;
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) throw error;

    return {
      storeName: data.store_name,
      tagline: data.tagline,
      status: data.status,
      supportPhone: data.support_phone,
      supportEmail: data.support_email,
      deliveryFee: data.delivery_fee,
      freeDeliveryThreshold: data.free_delivery_threshold,
      taxRatePercent: data.tax_rate_percent,
      estimatedDeliveryMinMinutes: data.estimated_delivery_min_minutes,
      estimatedDeliveryMaxMinutes: data.estimated_delivery_max_minutes,
      currencySymbol: data.currency_symbol,
      announcementText: data.announcement_text,
      isOpen24Hours: data.is_open_24_hours,
    };
  },

  async updateSettings(settings: Partial<StoreSettings>) {
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (settings.storeName !== undefined) updates.store_name = settings.storeName;
    if (settings.tagline !== undefined) updates.tagline = settings.tagline;
    if (settings.status !== undefined) updates.status = settings.status;
    if (settings.supportPhone !== undefined) updates.support_phone = settings.supportPhone;
    if (settings.supportEmail !== undefined) updates.support_email = settings.supportEmail;
    if (settings.deliveryFee !== undefined) updates.delivery_fee = settings.deliveryFee;
    if (settings.freeDeliveryThreshold !== undefined) updates.free_delivery_threshold = settings.freeDeliveryThreshold;
    if (settings.taxRatePercent !== undefined) updates.tax_rate_percent = settings.taxRatePercent;
    if (settings.estimatedDeliveryMinMinutes !== undefined) updates.estimated_delivery_min_minutes = settings.estimatedDeliveryMinMinutes;
    if (settings.estimatedDeliveryMaxMinutes !== undefined) updates.estimated_delivery_max_minutes = settings.estimatedDeliveryMaxMinutes;
    if (settings.currencySymbol !== undefined) updates.currency_symbol = settings.currencySymbol;
    if (settings.announcementText !== undefined) updates.announcement_text = settings.announcement_text;
    if (settings.isOpen24Hours !== undefined) updates.is_open_24_hours = settings.isOpen24Hours;

    const { data, error } = await supabase
      .from('store_settings')
      .update(updates)
      .eq('id', 'default')
      .select()
      .single();

    if (error) throw error;

    return {
      storeName: data.store_name,
      tagline: data.tagline,
      status: data.status,
      supportPhone: data.support_phone,
      supportEmail: data.support_email,
      deliveryFee: data.delivery_fee,
      freeDeliveryThreshold: data.free_delivery_threshold,
      taxRatePercent: data.tax_rate_percent,
      estimatedDeliveryMinMinutes: data.estimated_delivery_min_minutes,
      estimatedDeliveryMaxMinutes: data.estimated_delivery_max_minutes,
      currencySymbol: data.currency_symbol,
      announcementText: data.announcement_text,
      isOpen24Hours: data.is_open_24_hours,
    };
  },

  // Back in stock requests
  async getBackInStockRequests() {
    const { data, error } = await supabase
      .from('back_in_stock_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createBackInStockRequest(productId: string, productName: string, email: string, phone?: string) {
    if (!productId || !email) {
      throw new Error('Product ID and email are required');
    }

    const newRequest = {
      id: `bis-${Date.now()}`,
      product_id: productId,
      product_name: productName,
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      notified: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('back_in_stock_requests')
      .insert(newRequest)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `We will notify ${email} as soon as this item is back in stock!`,
      request: data,
    };
  },
};