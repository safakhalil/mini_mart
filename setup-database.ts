import { supabase } from './src/lib/supabase';

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database tables...');

  try {
    // Create categories table
    console.log('Creating categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
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
      `
    });
    if (categoriesError) console.error('Categories table error:', categoriesError);
    else console.log('✅ Categories table created');

    // Create products table
    console.log('Creating products table...');
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          brand TEXT,
          category_id TEXT,
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
      `
    });
    if (productsError) console.error('Products table error:', productsError);
    else console.log('✅ Products table created');

    // Create customers table
    console.log('Creating customers table...');
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
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
      `
    });
    if (customersError) console.error('Customers table error:', customersError);
    else console.log('✅ Customers table created');

    // Create orders table
    console.log('Creating orders table...');
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
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
      `
    });
    if (ordersError) console.error('Orders table error:', ordersError);
    else console.log('✅ Orders table created');

    // Create promotions table
    console.log('Creating promotions table...');
    const { error: promotionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS promotions (
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
      `
    });
    if (promotionsError) console.error('Promotions table error:', promotionsError);
    else console.log('✅ Promotions table created');

    // Create reviews table
    console.log('Creating reviews table...');
    const { error: reviewsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          user_name TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          date DATE,
          comment TEXT,
          verified_purchase BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (reviewsError) console.error('Reviews table error:', reviewsError);
    else console.log('✅ Reviews table created');

    // Create store_settings table
    console.log('Creating store_settings table...');
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS store_settings (
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
      `
    });
    if (settingsError) console.error('Store settings table error:', settingsError);
    else console.log('✅ Store settings table created');

    // Create back_in_stock_requests table
    console.log('Creating back_in_stock_requests table...');
    const { error: backInStockError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS back_in_stock_requests (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          product_name TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          notified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (backInStockError) console.error('Back in stock requests table error:', backInStockError);
    else console.log('✅ Back in stock requests table created');

    // Insert default store settings
    console.log('Inserting default store settings...');
    const { error: insertSettingsError } = await supabase
      .from('store_settings')
      .upsert({
        id: 'default',
        store_name: '24/7 Mart',
        tagline: 'Your Everyday Essentials. Anytime.',
        status: 'OPEN_24_7',
        support_phone: '+1 (800) 247-MART',
        support_email: 'support@247mart.com',
        delivery_fee: 3.99,
        free_delivery_threshold: 35.00,
        tax_rate_percent: 7.5,
        estimated_delivery_min_minutes: 25,
        estimated_delivery_max_minutes: 35,
        currency_symbol: '$',
        announcement_text: 'OPEN 24/7 • Fast Delivery in 25–35 Mins • Fresh Groceries & Essentials',
        is_open_24_hours: true,
      }, { onConflict: 'id' });

    if (insertSettingsError) console.error('Insert settings error:', insertSettingsError);
    else console.log('✅ Default store settings inserted');

    console.log('✨ Database setup completed!');
    console.log('📊 Now run: bun run seed to populate initial data');

  } catch (error) {
    console.error('❌ Error during database setup:', error);
    console.log('\n💡 Alternative: Run the SQL manually in Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy contents of supabase-schema.sql');
    console.log('4. Paste and run the query');
  }
}

setupDatabase();