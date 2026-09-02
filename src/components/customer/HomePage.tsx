import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
  ShoppingBag,
  Flame,
  ShieldCheck,
  ChevronRight,
  Percent,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';

interface HomePageProps {
  onNavigate: (tab: string, param?: string) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onQuickView,
  onSelectProduct,
}) => {
  const { products, categories } = useStore();

  // Flash deals countdown timer (simulated 24-hour cycle)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.isDealOfTheDay || (p.discountPercent && p.discountPercent >= 15)).slice(0, 4);
  const popularSnacks = products.filter((p) => p.categoryId === 'snacks' || p.categoryId === 'beverages').slice(0, 4);
  const dailyEssentials = products.filter((p) => p.isDailyEssential || p.categoryId === 'dairy' || p.categoryId === 'fresh-food').slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Promotional Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0E1116] via-[#161B22] to-[#1F2530] text-white border border-[#1F2530] shadow-xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="whitespace-nowrap">Ultra-Fast 24/7 Delivery • 25–35 Mins</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-[1.1] sm:leading-[1.15] text-white">
              Everything You Need, <br className="hidden sm:inline" />
              <span className="text-emerald-400">Anytime.</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-lg leading-relaxed">
              Shop fresh groceries, ice cold drinks, midnight snacks and everyday essentials with guaranteed fast doorstep delivery in 25–35 minutes, 24 hours a day.
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Shop Now</span>
              </button>

              <button
                onClick={() => onNavigate('categories')}
                className="bg-white/10 hover:bg-white/15 active:scale-95 text-white border border-white/15 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Quick value badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10 text-[10px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Open 24/7/365</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="font-medium">25–35 Min ETA</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">100% Fresh Guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Promotional Image Banner & Floating Tag */}
          <div className="lg:col-span-5 relative flex justify-center order-first lg:order-last">
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-4/3 lg:aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="24/7 Mart Fresh Groceries"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116]/90 via-transparent to-transparent" />

              {/* Floating Promo Overlay Card */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-[#0E1116]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                    Special Promo
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Save 20% on First Order</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Use code MART24 at checkout</p>
                </div>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-2.5 sm:px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] sm:text-xs rounded-lg transition-colors"
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Promotional Grid Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('shop', 'deals')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-3.5 sm:p-5 cursor-pointer border border-emerald-800/40 hover:shadow-lg transition-all"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Flash Offers
            </span>
            <h3 className="font-black text-base sm:text-lg text-white">Fresh Deals</h3>
            <p className="text-[10px] sm:text-xs text-slate-300">Up to 25% OFF fresh produce & dairy</p>
            <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
              <span>Shop Deals</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="absolute right-2 -bottom-2 w-16 h-16 sm:w-24 sm:h-24 opacity-30 group-hover:scale-110 transition-transform">
            <Percent className="w-full h-full text-emerald-400" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('shop', 'snacks')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950 to-slate-900 text-white p-3.5 sm:p-5 cursor-pointer border border-amber-800/40 hover:shadow-lg transition-all"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Late Night
            </span>
            <h3 className="font-black text-base sm:text-lg text-white">Snacks & Drinks</h3>
            <p className="text-[10px] sm:text-xs text-slate-300">Chips, sodas, chocolates & ice cream</p>
            <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>Explore Snacks</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="absolute right-2 -bottom-2 w-16 h-16 sm:w-24 sm:h-24 opacity-30 group-hover:scale-110 transition-transform">
            <Zap className="w-full h-full text-amber-400" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('shop', 'groceries')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-950 to-slate-900 text-white p-3.5 sm:p-5 cursor-pointer border border-teal-800/40 hover:shadow-lg transition-all"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-teal-400 uppercase tracking-wider">
              Pantry Staples
            </span>
            <h3 className="font-black text-base sm:text-lg text-white">Daily Essentials</h3>
            <p className="text-[10px] sm:text-xs text-slate-300">Milk, bread, farm eggs, pasta & oils</p>
            <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
              <span>View Essentials</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="absolute right-2 -bottom-2 w-16 h-16 sm:w-24 sm:h-24 opacity-30 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-full h-full text-teal-400" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('shop', 'deals')}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-950 to-slate-900 text-white p-3.5 sm:p-5 cursor-pointer border border-rose-800/40 hover:shadow-lg transition-all"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-rose-400 uppercase tracking-wider">
              Limited Time
            </span>
            <h3 className="font-black text-base sm:text-lg text-white">Weekend Offers</h3>
            <p className="text-[10px] sm:text-xs text-slate-300">Stock up your pantry & save big</p>
            <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-rose-300 group-hover:translate-x-1 transition-transform">
              <span>Check Specials</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="absolute right-2 -bottom-2 w-16 h-16 sm:w-24 sm:h-24 opacity-30 group-hover:scale-110 transition-transform">
            <Flame className="w-full h-full text-rose-400" />
          </div>
        </div>
      </section>

      {/* Categories Horizontal Quick Scroll */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0E1116] tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
              Select a category to view fresh items in stock
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-[10px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All (12)</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.id)}
              className="group bg-white rounded-2xl border border-slate-100 p-2 sm:p-3 hover:shadow-md hover:border-slate-200 cursor-pointer transition-all flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-1.5 sm:mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-[10px] sm:text-xs text-[#0E1116] group-hover:text-emerald-600 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">
                {cat.itemCount} items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Fresh Deals & Flash Offers Section with Countdown Timer */}
      <section className="bg-amber-500/5 rounded-3xl border border-amber-200/60 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0E1116] tracking-tight">
                  Fresh Deals of the Day
                </h2>
                <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HOT
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                Limited quantity discounts refreshed daily
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-amber-200 shadow-xs self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Ends in:</span>
            <div className="flex items-center gap-0.5 sm:gap-1 font-mono-num font-bold text-[10px] sm:text-xs text-amber-700">
              <span className="bg-amber-100 px-1 sm:px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-amber-100 px-1 sm:px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-amber-100 px-1 sm:px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {dealProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigateDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Popular Late-Night Snacks & Cold Drinks */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0E1116] tracking-tight">
              Snacks & Cold Drinks
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
              Crisp chips, sodas, energy drinks & chilled treats
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop', 'snacks')}
            className="text-[10px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>See All Snacks</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularSnacks.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigateDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Daily Essentials & Dairy */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0E1116] tracking-tight">
              Everyday Essentials & Fresh Dairy
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
              Fresh milk, brown eggs, sourdough bread & organic fruits
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop', 'dairy')}
            className="text-[10px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>See Essentials</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {dailyEssentials.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigateDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Why Choose 24/7 Mart Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Convenience Redefined
          </span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
            Delivering 24 Hours A Day, 7 Days A Week
          </h3>
          <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed">
            Whether you need breakfast ingredients before dawn, emergency household supplies in the afternoon, or midnight cravings at 2 AM — 24/7 Mart is always stocked and delivering in 25–35 minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] sm:text-xs px-4 sm:px-5 py-2 sm:py-3 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
