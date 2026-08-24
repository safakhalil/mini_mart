# Supabase Setup Instructions

## Current Status

✅ **The application is running with in-memory data (fallback mode)**

The app automatically detects if Supabase tables exist and falls back to in-memory storage if they don't. This means the app works immediately without any database setup!

## To Enable Supabase Database

When you're ready to use Supabase for persistent data storage:

### Step 1: Set Up Database Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query** 
4. Copy the contents of `supabase-schema.sql` and paste it into the SQL editor
5. Click **Run** to execute the schema creation

This will create all the necessary tables:
- `categories` - Product categories
- `products` - Product inventory
- `customers` - Customer information
- `orders` - Order data
- `promotions` - Discount codes and promotions
- `reviews` - Product reviews
- `store_settings` - Store configuration
- `back_in_stock_requests` - Stock notification requests

### Step 2: Seed Initial Data

After setting up the schema, run the seed script to populate the database with initial data:

```bash
bun run seed
```

This will load:
- 12 product categories
- 24 sample products
- 3 sample customers
- 2 sample orders
- 3 promotional codes
- 3 sample reviews
- Default store settings

### Step 3: Restart the Server

Stop the current server (Ctrl+C) and restart it:

```bash
bun server.ts
```

You should see: `✅ Connected to Supabase database` instead of the fallback message.

## Environment Variables

Your `.env.local` file should already contain the Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL="https://jvepencwvugjszxvsmgh.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_4qmEAAKSqK2JkCVvTaq2RQ_kFPZz2Zn"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZXBlbmN3dnVnanN6eHZzbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzY3NjAsImV4cCI6MjEwMzE1Mjc2MH0.FO0f-ngsAY1B-ieFe_tx8SljJKnmKlw8dUmJEjRl5gs"
```

## Running the Application

### Current (In-Memory Mode)
```bash
bun server.ts
```
The app works with in-memory data - changes are lost on server restart.

### With Supabase (Persistent Mode)
1. Set up the database schema in Supabase (see above)
2. Seed the initial data: `bun run seed`
3. Start the development server: `bun server.ts`

The application will now use Supabase as the backend database instead of in-memory storage.

## Features Now Using Supabase (When Configured)

- ✅ Product catalog and inventory management
- ✅ Order processing and tracking
- ✅ Customer management
- ✅ Promotion/coupon system
- ✅ Product reviews and ratings
- ✅ Store settings configuration
- ✅ Back-in-stock notifications
- ✅ Analytics and reporting

## Troubleshooting

If you encounter connection errors:
1. Verify your Supabase URL and keys in `.env.local`
2. Check that the tables were created successfully in the Supabase dashboard
3. Ensure Row Level Security (RLS) policies allow the anon key to read/write data
4. Check the browser console and server logs for specific error messages

## Automatic Fallback

The application automatically falls back to in-memory data if:
- Supabase connection fails
- Tables don't exist in the database
- Environment variables are missing

This ensures the app always works, even without database setup!