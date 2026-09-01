import express from 'express';
import path from 'path';
import { db } from './src/lib/database';
import { Product, Order, Promotion, Customer, StoreSettings, Review } from './src/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PROMOTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
} from './src/data/mockData';

// Fallback in-memory data if Supabase is not configured
let useSupabase = true;
let categories = [...INITIAL_CATEGORIES];
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let promotions: Promotion[] = [...INITIAL_PROMOTIONS];
let customers: Customer[] = [...INITIAL_CUSTOMERS];
let storeSettings: StoreSettings = { ...INITIAL_SETTINGS, adminPin: '1234' };
let reviews: Review[] = [...INITIAL_REVIEWS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Test Supabase connection
  try {
    await db.getSettings();
    console.log('✅ Connected to Supabase database');
  } catch (error) {
    console.log('⚠️  Supabase not configured, using in-memory data');
    console.log('💡 Run SQL from supabase-schema.sql in Supabase dashboard to enable database');
    useSupabase = false;
  }

  // API ROUTES

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', async (req, res) => {
    try {
      if (useSupabase) {
        const settings = await db.getSettings();
        res.json(settings);
      } else {
        res.json(storeSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', async (req, res) => {
    try {
      if (useSupabase) {
        const updatedSettings = await db.updateSettings(req.body);
        res.json(updatedSettings);
      } else {
        storeSettings = { ...storeSettings, ...req.body };
        res.json(storeSettings);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      if (useSupabase) {
        const categories = await db.getCategories();
        res.json(categories);
      } else {
        const categoriesWithCount = categories.map((cat) => ({
          ...cat,
          itemCount: products.filter((p) => p.categoryId === cat.id && p.status === 'active').length,
        }));
        res.json(categoriesWithCount);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { category, search, minPrice, maxPrice, stockStatus, sort, featured } = req.query;
      
      if (useSupabase) {
        const filters: any = {};
        if (category) filters.category = category as string;
        if (search) filters.search = search as string;
        if (minPrice) filters.minPrice = parseFloat(minPrice as string);
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
        if (stockStatus) filters.stockStatus = stockStatus as string;
        if (sort) filters.sort = sort as string;
        if (featured) filters.featured = featured === 'true';

        const products = await db.getProducts(filters);
        res.json(products);
      } else {
        let filtered = [...products];

        if (category && category !== 'all') {
          filtered = filtered.filter((p) => p.categoryId === category);
        }

        if (featured === 'true') {
          filtered = filtered.filter((p) => p.isFeatured || p.isDealOfTheDay || p.isDailyEssential);
        }

        if (search && typeof search === 'string') {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.categoryName.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (minPrice) {
          filtered = filtered.filter((p) => p.price >= parseFloat(minPrice as string));
        }
        if (maxPrice) {
          filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice as string));
        }

        if (stockStatus === 'in_stock') {
          filtered = filtered.filter((p) => p.stock > 0);
        }

        // Sorting
        if (sort === 'price_asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'popular') {
          filtered.sort((a, b) => b.salesCount - a.salesCount);
        } else if (sort === 'newest') {
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        res.json(filtered);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      if (useSupabase) {
        const product = await db.getProductById(req.params.id);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
      } else {
        const product = products.find((p) => p.id === req.params.id || p.slug === req.params.id);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      if (useSupabase) {
        const newProduct = await db.createProduct(req.body);
        res.status(201).json(newProduct);
      } else {
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          createdAt: new Date().toISOString(),
          salesCount: 0,
          rating: 5.0,
          reviewCount: 0,
          images: req.body.images && req.body.images.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'],
          tags: req.body.tags || [req.body.brand || 'Groceries'],
          status: req.body.status || 'active',
          ...req.body,
        };

        if (newProduct.originalPrice && newProduct.originalPrice > newProduct.price) {
          newProduct.discountPercent = Math.round(
            ((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100
          );
        }

        products.unshift(newProduct);
        res.status(201).json(newProduct);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      if (useSupabase) {
        const updatedProduct = await db.updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
      } else {
        const index = products.findIndex((p) => p.id === req.params.id);
        if (index === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }

        products[index] = {
          ...products[index],
          ...req.body,
        };

        if (products[index].originalPrice && products[index].originalPrice! > products[index].price) {
          products[index].discountPercent = Math.round(
            ((products[index].originalPrice! - products[index].price) / products[index].originalPrice!) * 100
          );
        }

        res.json(products[index]);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      if (useSupabase) {
        const result = await db.deleteProduct(req.params.id);
        res.json(result);
      } else {
        const initialLen = products.length;
        products = products.filter((p) => p.id !== req.params.id);
        if (products.length === initialLen) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Stock / Inventory
  app.patch('/api/products/:id/stock', async (req, res) => {
    try {
      const { stock } = req.body;
      if (typeof stock !== 'number') {
        return res.status(400).json({ error: 'Invalid stock count' });
      }

      if (useSupabase) {
        const updatedProduct = await db.updateProductStock(req.params.id, stock);
        res.json(updatedProduct);
      } else {
        const product = products.find((p) => p.id === req.params.id);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        product.stock = stock;
        if (stock <= 0) {
          product.status = 'out_of_stock';
        } else if (product.status === 'out_of_stock') {
          product.status = 'active';
        }
        res.json(product);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({ error: 'Failed to update stock' });
    }
  });

  // Orders
  app.get('/api/orders', async (req, res) => {
    try {
      const { status, email } = req.query;
      
      if (useSupabase) {
        const filters: any = {};
        if (status) filters.status = status as string;
        if (email) filters.email = email as string;
        
        const orders = await db.getOrders(filters);
        res.json(orders);
      } else {
        let result = [...orders];
        if (status && status !== 'all') {
          result = result.filter((o) => o.status === status);
        }
        if (email) {
          result = result.filter((o) => o.customerEmail.toLowerCase() === (email as string).toLowerCase());
        }
        res.json(result);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      if (useSupabase) {
        const order = await db.getOrderById(req.params.id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
      } else {
        const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      if (useSupabase) {
        const settings = await db.getSettings();
        const newOrder = await db.createOrder(req.body, settings);
        res.status(201).json(newOrder);
      } else {
        const orderCount = orders.length + 10246;
        const now = new Date();
        const estMin = storeSettings.estimatedDeliveryMinMinutes || 25;
        const estMax = storeSettings.estimatedDeliveryMaxMinutes || 35;

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: `#247M-${orderCount}`,
          createdAt: now.toISOString(),
          status: 'pending',
          paymentStatus: req.body.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
          estimatedDeliveryTime: `${estMin}-${estMax} mins`,
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
          ...req.body,
        };

        // Deduct stock and increment sales count
        if (newOrder.items) {
          newOrder.items.forEach((item) => {
            const p = products.find((prod) => prod.id === item.productId);
            if (p) {
              p.stock = Math.max(0, p.stock - item.quantity);
              p.salesCount = (p.salesCount || 0) + item.quantity;
              if (p.stock === 0) p.status = 'out_of_stock';
            }
          });
        }

        orders.unshift(newOrder);

        // Update or add customer record
        const existingCust = customers.find((c) => c.email.toLowerCase() === newOrder.customerEmail.toLowerCase());
        if (existingCust) {
          existingCust.ordersCount += 1;
          existingCust.totalSpent += newOrder.total;
          existingCust.lastOrderDate = newOrder.createdAt;
        } else {
          customers.unshift({
            id: `cust-${Date.now()}`,
            name: newOrder.customerName,
            email: newOrder.customerEmail,
            phone: newOrder.customerPhone,
            ordersCount: 1,
            totalSpent: newOrder.total,
            lastOrderDate: newOrder.createdAt,
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            savedAddresses: [newOrder.deliveryAddress],
          });
        }

        res.status(201).json(newOrder);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      
      if (useSupabase) {
        const updatedOrder = await db.updateOrderStatus(req.params.id, status);
        res.json(updatedOrder);
      } else {
        const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;

        // Update timeline step completions
        const statusOrder = ['pending', 'confirmed', 'preparing', 'out_of_delivery', 'delivered'];
        const currentIdx = statusOrder.indexOf(status);

        order.timeline.forEach((step) => {
          const stepIdx = statusOrder.indexOf(step.status);
          if (stepIdx <= currentIdx && currentIdx !== -1) {
            step.completed = true;
          }
        });

        if (status === 'delivered') {
          order.paymentStatus = 'paid';
        }

        res.json(order);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Promotions
  app.get('/api/promotions', async (req, res) => {
    try {
      if (useSupabase) {
        const promotions = await db.getPromotions();
        res.json(promotions);
      } else {
        res.json(promotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      res.status(500).json({ error: 'Failed to fetch promotions' });
    }
  });

  app.post('/api/promotions', async (req, res) => {
    try {
      if (useSupabase) {
        const newPromotion = await db.createPromotion(req.body);
        res.status(201).json(newPromotion);
      } else {
        const newPromo: Promotion = {
          id: `promo-${Date.now()}`,
          usedCount: 0,
          status: 'active',
          ...req.body,
        };
        promotions.unshift(newPromo);
        res.status(201).json(newPromo);
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      res.status(500).json({ error: 'Failed to create promotion' });
    }
  });

  app.post('/api/promotions/validate', async (req, res) => {
    try {
      const { code, orderAmount } = req.body;
      
      if (useSupabase) {
        const settings = await db.getSettings();
        const result = await db.validatePromotion(code, orderAmount, settings);
        res.json(result);
      } else {
        if (!code) {
          return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });
        }
        const promo = promotions.find(
          (p) => p.code.toUpperCase() === code.toUpperCase().trim() && p.status === 'active'
        );
        if (!promo) {
          return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
        }

        if (orderAmount < promo.minOrderAmount) {
          return res.status(400).json({
            valid: false,
            message: `Minimum order amount of $${promo.minOrderAmount.toFixed(2)} required for this coupon`,
          });
        }

        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
          discountAmount = (orderAmount * promo.discountValue) / 100;
          if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
            discountAmount = promo.maxDiscount;
          }
        } else if (promo.discountType === 'fixed') {
          discountAmount = Math.min(orderAmount, promo.discountValue);
        } else if (promo.discountType === 'free_delivery') {
          discountAmount = storeSettings.deliveryFee;
        }

        res.json({
          valid: true,
          promo,
          discountAmount: Number(discountAmount.toFixed(2)),
          message: `Coupon "${promo.code}" applied successfully!`,
        });
      }
    } catch (error: any) {
      console.error('Error validating promotion:', error);
      res.status(400).json({ valid: false, message: error.message });
    }
  });

  // Customers
  app.get('/api/customers', async (req, res) => {
    try {
      if (useSupabase) {
        const customers = await db.getCustomers();
        res.json(customers);
      } else {
        res.json(customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const { productId } = req.query;
      
      if (useSupabase) {
        const reviews = await db.getReviews(productId as string);
        res.json(reviews);
      } else {
        if (productId) {
          return res.json(reviews.filter((r) => r.productId === productId));
        }
        res.json(reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      if (useSupabase) {
        const newReview = await db.createReview(req.body);
        res.status(201).json(newReview);
      } else {
        const newReview: Review = {
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          verifiedPurchase: true,
          ...req.body,
        };
        reviews.unshift(newReview);

        // Update product rating
        const prod = products.find((p) => p.id === newReview.productId);
        if (prod) {
          const prodReviews = reviews.filter((r) => r.productId === prod.id);
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          prod.rating = Number(avg.toFixed(1));
          prod.reviewCount = prodReviews.length;
        }

        res.status(201).json(newReview);
      }
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Back In Stock Notification Requests
  let backInStockRequests: { id: string; productId: string; productName: string; email: string; phone?: string; createdAt: string; notified: boolean }[] = [];

  app.get('/api/back-in-stock', async (req, res) => {
    try {
      if (useSupabase) {
        const requests = await db.getBackInStockRequests();
        res.json(requests);
      } else {
        res.json(backInStockRequests);
      }
    } catch (error) {
      console.error('Error fetching back in stock requests:', error);
      res.status(500).json({ error: 'Failed to fetch back in stock requests' });
    }
  });

  app.post('/api/back-in-stock', async (req, res) => {
    try {
      const { productId, email, phone } = req.body;
      
      if (useSupabase) {
        const product = await db.getProductById(productId);
        const productName = product ? product.name : 'Unknown Product';
        const result = await db.createBackInStockRequest(productId, productName, email, phone);
        res.status(201).json(result);
      } else {
        if (!productId || !email) {
          return res.status(400).json({ error: 'Product ID and email are required' });
        }
        const prod = products.find((p) => p.id === productId);
        const newRequest = {
          id: `bis-${Date.now()}`,
          productId,
          productName: prod ? prod.name : 'Unknown Product',
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || '',
          createdAt: new Date().toISOString(),
          notified: false,
        };
        backInStockRequests.unshift(newRequest);
        res.status(201).json({
          success: true,
          message: `We will notify ${email} as soon as this item is back in stock!`,
          request: newRequest,
        });
      }
    } catch (error: any) {
      console.error('Error creating back in stock request:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Analytics
  app.get('/api/analytics', async (req, res) => {
    try {
      let ordersData, productsData, customersData, categoriesData;

      if (useSupabase) {
        ordersData = await db.getOrders();
        productsData = await db.getProducts();
        customersData = await db.getCustomers();
        categoriesData = await db.getCategories();
      } else {
        ordersData = orders;
        productsData = products;
        customersData = customers;
        categoriesData = categories;
      }

      const totalRevenue = ordersData.reduce((sum: number, o: any) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
      const totalOrdersCount = ordersData.length;
      const pendingOrdersCount = ordersData.filter((o: any) => o.status === 'pending' || o.status === 'preparing' || o.status === 'confirmed').length;
      const lowStockCount = productsData.filter((p: any) => (p.stock || 0) <= (p.lowStockThreshold || p.low_stock_threshold || 10)).length;
      const totalCustomersCount = customersData.length;

      // Daily revenue mock trends
      const dailyData = [
        { date: 'Mon', revenue: 4210, orders: 124, customers: 18 },
        { date: 'Tue', revenue: 5430, orders: 168, customers: 24 },
        { date: 'Wed', revenue: 6120, orders: 195, customers: 31 },
        { date: 'Thu', revenue: 5890, orders: 180, customers: 27 },
        { date: 'Fri', revenue: 7650, orders: 240, customers: 42 },
        { date: 'Sat', revenue: 9140, orders: 285, customers: 56 },
        { date: 'Sun', revenue: 8420, orders: 248, customers: 49 },
      ];

      const categorySales = categoriesData.map((cat: any) => {
        const catId = cat.id;
        const prods = productsData.filter((p: any) => (p.categoryId || p.category_id) === catId);
        const sales = prods.reduce((sum: number, p: any) => sum + ((p.salesCount || p.sales_count || 0) * p.price), 0);
        return {
          name: cat.name.split(' ')[0],
          sales: Math.round(sales) || Math.floor(Math.random() * 800 + 200),
        };
      });

      const topSelling = [...productsData]
        .sort((a: any, b: any) => (b.salesCount || b.sales_count || 0) - (a.salesCount || a.sales_count || 0))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          sales: p.salesCount || p.sales_count || 0,
          revenue: Number(((p.salesCount || p.sales_count || 0) * p.price).toFixed(2)),
          image: p.images[0],
          category: p.categoryName || p.category_name,
        }));

      res.json({
        todayRevenue: 8420.50,
        revenueGrowth: 12.4,
        totalOrders: totalOrdersCount,
        ordersGrowth: 8.2,
        pendingOrders: pendingOrdersCount,
        lowStock: lowStockCount,
        totalCustomers: totalCustomersCount,
        customersGrowth: 15.3,
        averageOrderValue: totalOrdersCount ? Number((totalRevenue / totalOrdersCount).toFixed(2)) : 0,
        dailyData,
        categorySales,
        topSelling,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Protected Admin Route
  app.get('/admin@BK', (req, res) => {
    const validSecretKey = process.env.ADMIN_SECRET_KEY || 'BK-ADMIN-SECRET-2024';
    const providedSecret = req.query.secret || req.headers['x-admin-secret'];
    
    // Check for secret key authentication
    if (providedSecret === validSecretKey) {
      return res.json({
        success: true,
        message: 'Access granted via secret key',
        authenticated: true,
        method: 'secret_key'
      });
    }
    
    // Check for admin role authentication (would need session/token validation in production)
    const userRole = req.headers['x-user-role'];
    if (userRole === 'admin') {
      return res.json({
        success: true,
        message: 'Access granted via admin role',
        authenticated: true,
        method: 'admin_role'
      });
    }
    
    // Access denied
    return res.status(403).json({
      success: false,
      message: 'Access denied. Valid admin role or secret key required.',
      authenticated: false
    });
  });

  // Serve static files from dist in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`24/7 Mart API Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
