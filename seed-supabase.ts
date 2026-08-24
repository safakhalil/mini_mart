import { supabase } from './src/lib/supabase';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from './src/data/mockData';

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Seed categories
    console.log('Seeding categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(INITIAL_CATEGORIES);
    
    if (categoriesError) {
      console.error('Error seeding categories:', categoriesError);
    } else {
      console.log('Categories seeded successfully');
    }

    // Seed products
    console.log('Seeding products...');
    const { error: productsError } = await supabase
      .from('products')
      .insert(INITIAL_PRODUCTS);
    
    if (productsError) {
      console.error('Error seeding products:', productsError);
    } else {
      console.log('Products seeded successfully');
    }

    // Seed customers
    console.log('Seeding customers...');
    const { error: customersError } = await supabase
      .from('customers')
      .insert(INITIAL_CUSTOMERS);
    
    if (customersError) {
      console.error('Error seeding customers:', customersError);
    } else {
      console.log('Customers seeded successfully');
    }

    // Seed orders
    console.log('Seeding orders...');
    const { error: ordersError } = await supabase
      .from('orders')
      .insert(INITIAL_ORDERS);
    
    if (ordersError) {
      console.error('Error seeding orders:', ordersError);
    } else {
      console.log('Orders seeded successfully');
    }

    // Seed promotions
    console.log('Seeding promotions...');
    const { error: promotionsError } = await supabase
      .from('promotions')
      .insert(INITIAL_PROMOTIONS);
    
    if (promotionsError) {
      console.error('Error seeding promotions:', promotionsError);
    } else {
      console.log('Promotions seeded successfully');
    }

    // Seed reviews
    console.log('Seeding reviews...');
    const { error: reviewsError } = await supabase
      .from('reviews')
      .insert(INITIAL_REVIEWS);
    
    if (reviewsError) {
      console.error('Error seeding reviews:', reviewsError);
    } else {
      console.log('Reviews seeded successfully');
    }

    console.log('Database seed completed!');
  } catch (error) {
    console.error('Error during seed:', error);
  }
}

seedDatabase();