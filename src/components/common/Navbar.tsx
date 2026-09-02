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
  Zap,
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenSearch, onOpenCart, onOpenLocation }) => {
  const {
    cartCount,
    wishlist,
    selectedLocation,
    user,
    theme,
    toggleTheme,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-3 lg:gap-6">
          {/* Left: Mobile menu toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <div onClick={() => onNavigate('home')} className="shrink-0">
              <Logo size="sm" className="sm:md" />
            </div>
          </div>

          {/* Location selector (Desktop/Tablet) */}
          <button
            onClick={onOpenLocation}
            className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left max-w-[180px] sm:max-w-[220px]"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Deliver in 25 mins
              </span>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-800 truncate leading-tight">
                {selectedLocation.label}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {/* Center: Search input button */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-sm sm:max-w-md lg:max-w-xl hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer text-slate-400 hover:text-slate-600 transition-all group"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            <span className="text-[10px] sm:text-xs lg:text-sm truncate select-none">
              Search products...
            </span>
            <span className="ml-auto hidden lg:inline-block text-[10px] sm:text-[11px] font-mono text-slate-400 bg-white px-1 sm:px-1.5 py-0.5 rounded-md border border-slate-200">
              / search
            </span>
          </div>

          {/* Right: Actions (Theme Toggle, Deals, Wishlist, Orders, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search icon trigger for mobile */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Global Theme Toggle Component */}
            <ThemeToggle />

            {/* Quick Deals Link */}
            <button
              onClick={() => onNavigate('shop', 'deals')}
              className="hidden lg:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400" />
              <span className="hidden sm:inline">Deals</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-1.5 sm:p-2.5 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center font-mono-num">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders link */}
            <button
              onClick={() => onNavigate('orders')}
              className="hidden md:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              <span className="hidden sm:inline">Orders</span>
            </button>

            {/* Customer Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 sm:px-3 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[10px] sm:text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden lg:inline max-w-[60px] sm:max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 hidden lg:inline" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 sm:px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] sm:text-xs font-bold text-[#0E1116] truncate">{user.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <span>Order History</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <span>Saved Wishlist</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>


                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm shadow-emerald-600/25 transition-all duration-200"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 sm:-top-1.5 -right-1.5 sm:-right-2 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] bg-[#0E1116] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 sm:px-1 font-mono-num border border-emerald-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-[10px] sm:text-xs">Cart</span>
            </button>


          </div>
        </div>

        {/* Secondary Category / Navigation Links Bar on Desktop */}
        <div className="hidden lg:flex items-center justify-between py-2 sm:py-2.5 border-t border-slate-100 text-[10px] sm:text-xs font-medium text-slate-600">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 overflow-x-auto">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-emerald-600 transition-colors font-semibold whitespace-nowrap ${
                currentRoute === 'home' ? 'text-emerald-600' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-emerald-600 transition-colors font-semibold whitespace-nowrap ${
                currentRoute === 'shop' ? 'text-emerald-600' : ''
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${
                currentRoute === 'categories' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => onNavigate('shop', 'snacks')}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap hidden xl:inline"
            >
              Snacks & Crisps
            </button>
            <button
              onClick={() => onNavigate('shop', 'beverages')}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap hidden xl:inline"
            >
              Chilled Beverages
            </button>
            <button
              onClick={() => onNavigate('shop', 'fresh-food')}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap hidden 2xl:inline"
            >
              Fresh Produce
            </button>
            <button
              onClick={() => onNavigate('shop', 'dairy')}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap hidden 2xl:inline"
            >
              Dairy & Eggs
            </button>
            <button
              onClick={() => onNavigate('shop', 'frozen-food')}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap hidden 2xl:inline"
            >
              Ice Cream & Frozen
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-slate-500 font-medium shrink-0">
            <button
              onClick={() => onNavigate('orders')}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-[10px] sm:text-[11px]"
            >
              <span>Track Live Order</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold hidden sm:inline">
              Support 24/7: 1-800-247-MART
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              onOpenLocation();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2.5 sm:p-3 bg-slate-50 rounded-xl text-left"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase block">Delivery to</span>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-800 truncate">{selectedLocation.label}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold">Change</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium pt-1">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              All Products
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Categories
            </button>
            <button
              onClick={() => {
                onNavigate('shop', 'deals');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-amber-50 text-amber-900 text-left font-semibold"
            >
              ⚡ Flash Deals
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                onNavigate('wishlist');
                setIsMobileMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left font-semibold"
            >
              Wishlist ({wishlist.length})
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#21262D] flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">Appearance Theme:</span>
            <ThemeToggle showLabel />
          </div>


        </div>
      )}
    </header>
  );
};
