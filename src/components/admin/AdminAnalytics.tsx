import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  PieChart,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminAnalytics: React.FC = () => {
  const { analytics, categories, products } = useStore();

  const monthlySales = [
    { month: 'Jan', amount: 14200 },
    { month: 'Feb', amount: 16800 },
    { month: 'Mar', amount: 19400 },
    { month: 'Apr', amount: 22100 },
    { month: 'May', amount: 25900 },
    { month: 'Jun', amount: 28400 },
    { month: 'Jul', amount: 31200 },
    { month: 'Aug', amount: 34850 },
  ];

  const maxMonth = Math.max(...monthlySales.map((m) => m.amount));

  const categoryBreakdown = [
    { name: 'Snacks & Crisps', share: 28, color: 'bg-emerald-500' },
    { name: 'Chilled Beverages', share: 24, color: 'bg-teal-500' },
    { name: 'Dairy & Farm Eggs', share: 18, color: 'bg-blue-500' },
    { name: 'Fresh Fruits & Veg', share: 15, color: 'bg-amber-500' },
    { name: 'Frozen Foods & Ice Cream', share: 10, color: 'bg-purple-500' },
    { name: 'Bakery & Others', share: 5, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sales & Analytics Reports</h1>
          <p className="text-xs text-slate-400">
            Real-time performance metrics, grocery basket trends and peak hour distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Year to Date (2026)</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Gross Merchandising Value
          </span>
          <span className="font-mono-num text-3xl font-black text-white block">
            ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% year-over-year</span>
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Basket Size
          </span>
          <span className="font-mono-num text-3xl font-black text-emerald-400 block">
            ${analytics.averageOrderValue.toFixed(2)}
          </span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>3.8 items per order average</span>
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            On-Time 24/7 Delivery Rate
          </span>
          <span className="font-mono-num text-3xl font-black text-teal-400 block">
            98.4%
          </span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
            <span>Average delivery time: 24 mins</span>
          </span>
        </div>
      </div>

      {/* Revenue Trend Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Sales Revenue Chart */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Monthly Revenue Growth ($)</h3>
              <p className="text-xs text-slate-400">Consistent upward growth across 24/7 deliveries</p>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-3 items-end h-56 pt-6">
            {monthlySales.map((m) => {
              const heightPercent = (m.amount / maxMonth) * 100;
              return (
                <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="font-mono-num text-[10px] font-bold text-slate-400">
                    ${(m.amount / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full bg-slate-900 rounded-xl h-full flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg shadow-sm shadow-emerald-500/20 transition-all hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white">Category Sales Share</h3>
            <p className="text-xs text-slate-400">Top revenue generating departments</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">{cat.name}</span>
                  <span className="font-mono-num text-emerald-400 font-bold">{cat.share}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full`}
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="text-emerald-400 font-bold block mb-0.5">Top Insight:</span>
            Late-night snack and chilled drink orders surge by +65% between 10 PM and 2 AM.
          </div>
        </div>
      </div>
    </div>
  );
};
