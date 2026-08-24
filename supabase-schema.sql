-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  image TEXT,
  item_count INTEGER DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  category_id TEXT REFERENCES categories(id),
  category_name TEXT,
  description TEXT,
  size_weight TEXT,
  unit TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  discount_percent INTEGER,
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  sku TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  is_deal_of_the_day BOOLEAN DEFAULT FALSE,
  is_daily_essential BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]'::jsonb,
  ingredients TEXT,
  nutrition JSONB,
  status TEXT DEFAULT 'active',
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar TEXT,
  orders_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  joined_date DATE,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  promo_code TEXT,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  delivery_address JSONB,
  estimated_delivery_time TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table
CREATE TABLE promotions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date DATE,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store settings table
CREATE TABLE store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL,
  tagline TEXT,
  status TEXT,
  support_phone TEXT,
  support_email TEXT,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  free_delivery_threshold DECIMAL(10,2) DEFAULT 0,
  tax_rate_percent DECIMAL(5,2) DEFAULT 0,
  estimated_delivery_min_minutes INTEGER DEFAULT 25,
  estimated_delivery_max_minutes INTEGER DEFAULT 35,
  currency_symbol TEXT DEFAULT '$',
  announcement_text TEXT,
  is_open_24_hours BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Back in stock requests table
CREATE TABLE back_in_stock_requests (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_back_in_stock_product_id ON back_in_stock_requests(product_id);
CREATE INDEX idx_back_in_stock_email ON back_in_stock_requests(email);

-- Insert initial store settings
INSERT INTO store_settings (
  store_name, tagline, status, support_phone, support_email, 
  delivery_fee, free_delivery_threshold, tax_rate_percent,
  estimated_delivery_min_minutes, estimated_delivery_max_minutes,
  currency_symbol, announcement_text, is_open_24_hours
) VALUES (
  '24/7 Mart',
  'Your Everyday Essentials. Anytime.',
  'OPEN_24_7',
  '+1 (800) 247-MART',
  'support@247mart.com',
  3.99,
  35.00,
  7.5,
  25,
  35,
  '$',
  'OPEN 24/7 • Fast Delivery in 25–35 Mins • Fresh Groceries & Essentials',
  TRUE
);