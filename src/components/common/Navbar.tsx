import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  MapPin,
  User,
  Heart,
  Package,
  Menu,
  X,
  ChevronDown,
  Shield,
  Zap,
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const {
    cartCount,
    wishlist,
    selectedLocation,
    setIsCartOpen,
    setIsSearchOpen,
    setIsLocationModalOpen,
    user,
    adminUser,
    theme,
    toggleTheme,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Left: Mobile menu toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div onClick={() => onNavigate('home')} className="shrink-0">
              <Logo size="md" />
            </div>
          </div>

          {/* Location selector (Desktop/Tablet) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left max-w-[220px]"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Deliver in 25 mins
              </span>
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {selectedLocation.label}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {/* Center: Search input button */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-xl hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer text-slate-400 hover:text-slate-600 transition-all group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            <span className="text-xs sm:text-sm truncate select-none">
              Search for products, groceries, drinks and more...
            </span>
            <span className="ml-auto hidden xl:inline-block text-[11px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
              / search
            </span>
          </div>

          {/* Right: Actions (Theme Toggle, Deals, Wishlist, Orders, Account, Cart, Admin Switch) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search icon trigger for mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Global Theme Toggle Component */}
            <ThemeToggle />

            {/* Quick Deals Link */}
            <button
              onClick={() => onNavigate('shop', 'deals')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Deals</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono-num">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders link */}
            <button
              onClick={() => onNavigate('orders')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Orders</span>
            </button>

            {/* Customer Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden xl:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:inline" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#0E1116] truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Order History</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span>Saved Wishlist</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Admin Management</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm shadow-emerald-600/25 transition-all duration-200"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-[#0E1116] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 font-mono-num border border-emerald-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">Cart</span>
            </button>

            {/* Admin Switch Shortcut Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors ml-1 shadow-xs"
              title="Switch to Store Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Secondary Category / Navigation Links Bar on Desktop */}
        <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-emerald-600 transition-colors font-semibold ${
                currentTab === 'home' ? 'text-emerald-600' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-emerald-600 transition-colors font-semibold ${
                currentTab === 'shop' ? 'text-emerald-600' : ''
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`hover:text-emerald-600 transition-colors ${
                currentTab === 'categories' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => onNavigate('shop', 'snacks')}
              className="hover:text-emerald-600 transition-colors"
            >
              Snacks & Crisps
            </button>
            <button
              onClick={() => onNavigate('shop', 'beverages')}
              className="hover:text-emerald-600 transition-colors"
            >
              Chilled Beverages
            </button>
            <button
              onClick={() => onNavigate('shop', 'fresh-food')}
              className="hover:text-emerald-600 transition-colors"
            >
              Fresh Produce
            </button>
            <button
              onClick={() => onNavigate('shop', 'dairy')}
              className="hover:text-emerald-600 transition-colors"
            >
              Dairy & Eggs
            </button>
            <button
              onClick={() => onNavigate('shop', 'frozen-food')}
              className="hover:text-emerald-600 transition-colors"
            >
              Ice Cream & Frozen
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <button
              onClick={() => onNavigate('orders')}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>Track Live Order</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Support 24/7: 1-800-247-MART
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setIsLocationModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-left"
          >
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery to</span>
              <p className="text-xs font-semibold text-slate-800 truncate">{selectedLocation.label}</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold">Change</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              All Products
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Categories
            </button>
            <button
              onClick={() => {
                onNavigate('shop', 'deals');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-900 text-left font-semibold"
            >
              ⚡ Flash Deals
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                onNavigate('wishlist');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Wishlist ({wishlist.length})
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#21262D] flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Appearance Theme:</span>
            <ThemeToggle showLabel />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#21262D]">
            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#0E1116] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Open Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
