import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product } from './types';

// Common UI
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { LocationModal } from './components/common/LocationModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Pages
import { HomePage } from './components/customer/HomePage';
import { CategoriesPage } from './components/customer/CategoriesPage';
import { ShopPage } from './components/customer/ShopPage';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderConfirmationPage } from './components/customer/OrderConfirmationPage';
import { OrderTrackingPage } from './components/customer/OrderTrackingPage';
import { CustomerAccountPage } from './components/customer/CustomerAccountPage';
import { WishlistPage } from './components/customer/WishlistPage';

// Admin
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainApp: React.FC = () => {
  const { orders } = useStore();

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<{
    categoryId?: string;
    productId?: string;
    orderId?: string;
    searchQuery?: string;
  }>({});

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check for admin access via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam === 'true') {
      setShowAdminLogin(true);
    }
  }, []);

  // Navigation helpers
  const navigateTo = (route: string, params: typeof routeParams = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string) => {
    navigateTo('shop', { categoryId: catId });
  };

  const handleSelectProduct = (productId: string) => {
    navigateTo('product', { productId });
  };

  const handleSearchSubmit = (query: string) => {
    navigateTo('shop', { searchQuery: query });
  };

  const handleOrderSuccess = (orderId: string) => {
    navigateTo('order-confirmation', { orderId });
  };

  const handleAdminAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    navigateTo('admin');
  };

  const handleAdminLoginCancel = () => {
    setShowAdminLogin(false);
    navigateTo('home');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminAuthTimestamp');
    navigateTo('home');
  };



  // Show admin login if needed
  if (showAdminLogin && !isAdminAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} onCancel={handleAdminLoginCancel} />;
  }

  // Customer Experience
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(route, param) => navigateTo(route, param)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {currentRoute === 'home' && (
          <HomePage
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateShop={() => navigateTo('shop')}
            onNavigateDeals={() => navigateTo('shop', { categoryId: 'deals' })}
          />
        )}

        {currentRoute === 'categories' && (
          <CategoriesPage onSelectCategory={handleSelectCategory} />
        )}

        {currentRoute === 'shop' && (
          <ShopPage
            initialCategoryId={routeParams.categoryId}
            initialSearchQuery={routeParams.searchQuery}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentRoute === 'product' && routeParams.productId && (
          <ProductDetailPage
            productId={routeParams.productId}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onBack={() => navigateTo('shop')}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            onSuccess={handleOrderSuccess}
            onBackToCart={() => navigateTo('shop')}
          />
        )}

        {currentRoute === 'order-confirmation' && (
          <OrderConfirmationPage
            orderId={routeParams.orderId}
            onTrackOrder={(orderId) => navigateTo('order-tracking', { orderId })}
            onContinueShopping={() => navigateTo('home')}
          />
        )}

        {currentRoute === 'order-tracking' && (
          <OrderTrackingPage
            orderId={routeParams.orderId}
            onBackToOrders={() => navigateTo('account')}
          />
        )}

        {currentRoute === 'account' && (
          <CustomerAccountPage
            onNavigateOrders={() => {
              if (orders.length > 0) {
                navigateTo('order-tracking', { orderId: orders[0].id });
              } else {
                navigateTo('home');
              }
            }}
            onNavigateWishlist={() => navigateTo('wishlist')}
          />
        )}

        {currentRoute === 'wishlist' && (
          <WishlistPage
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
            onNavigateShop={() => navigateTo('shop')}
          />
        )}

        {currentRoute === 'admin' && isAdminAuthenticated && (
          <AdminRoute>
            <AdminDashboard 
              onNavigate={navigateTo}
              onLogout={handleAdminLogout}
            />
          </AdminRoute>
        )}
      </main>

      {/* Store Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          handleSelectProduct(p.id);
        }}
        onSearchSubmit={(q) => {
          setIsSearchOpen(false);
          handleSearchSubmit(q);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          navigateTo('checkout');
        }}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigateDetails={handleSelectProduct}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
