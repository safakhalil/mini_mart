import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Clock,
  Bike,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { analytics, orders, products, updateOrderStatus, restockProduct, showToast } = useStore();

  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const recentOrders = orders.slice(0, 5);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
  };

  const handleQuickRestock = async (productId: string) => {
    await restockProduct(productId, 20);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Operations Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            24/7 Mart Management Hub
          </h1>
          <p className="text-xs text-slate-400">
            Real-time revenue, live order fulfillment queue, and inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('orders')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono-num text-2xl sm:text-3xl font-black text-white">
              ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{analytics.revenueGrowthPercent}%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Live transaction gross this month</p>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono-num text-2xl sm:text-3xl font-black text-white">
              {analytics.totalOrdersCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {orders.filter((o) => ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length} active currently
          </p>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono-num text-2xl sm:text-3xl font-black text-white">
              ${analytics.averageOrderValue.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+6.4%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Per basket average value</p>
        </div>

        {/* Metric 4: Active Customers */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono-num text-2xl sm:text-3xl font-black text-white">
              {analytics.totalCustomersCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.8%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">94.2% repeat order rate</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Low Stock Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Live Orders Queue */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Live Orders Fulfillment Queue</h3>
              <p className="text-xs text-slate-400">Instant status updates synced with courier app</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-200">
                      {order.deliveryAddress.fullName}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </td>
                    <td className="py-3.5 font-mono-num font-bold text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'delivered'
                            ? 'bg-slate-800 text-slate-300'
                            : order.status === 'out_for_delivery'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'preparing'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 rounded-lg px-2 py-1 focus:border-emerald-500 focus:outline-hidden"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Packing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Low Stock Warning ({lowStockProducts.length})</h3>
              </div>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                Inventory
              </button>
            </div>

            <div className="space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  All inventory shelves are healthy and well stocked!
                </p>
              ) : (
                lowStockProducts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg bg-white object-contain p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <span className="text-[11px] font-bold text-amber-400">
                          {item.stock} left in stock (Threshold: {item.lowStockThreshold})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickRestock(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-[11px] font-bold shrink-0 transition-colors"
                    >
                      +20 Units
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="text-emerald-400 font-bold block mb-0.5">Automated Re-Order Alert:</span>
            Suppliers auto-notified when cold items reach &lt; 5 units threshold.
          </div>
        </div>
      </div>

      {/* 24/7 Peak Demand Activity & Hourly Sales Breakdown */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">24/7 Hourly Order Activity Breakdown</h3>
            <p className="text-xs text-slate-400">
              Convenience order distribution across night shifts, morning coffee rush & afternoon snacking
            </p>
          </div>
        </div>

        {/* Visual Bar Chart for 24-Hour Day */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4">
          {[
            { hour: '12 AM', orders: 42, active: true },
            { hour: '2 AM', orders: 38, active: true },
            { hour: '4 AM', orders: 19, active: false },
            { hour: '6 AM', orders: 28, active: false },
            { hour: '8 AM', orders: 85, active: true },
            { hour: '10 AM', orders: 64, active: true },
            { hour: '12 PM', orders: 110, active: true },
            { hour: '2 PM', orders: 74, active: true },
            { hour: '4 PM', orders: 92, active: true },
            { hour: '6 PM', orders: 135, active: true },
            { hour: '8 PM', orders: 148, active: true },
            { hour: '10 PM', orders: 95, active: true },
          ].map((bar, idx) => {
            const heightPercent = Math.min(100, (bar.orders / 150) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className="font-mono-num text-[10px] text-slate-400 font-bold">
                  {bar.orders}
                </span>
                <div className="w-full bg-slate-800 rounded-lg h-28 flex items-end p-1">
                  <div
                    className={`w-full rounded-md transition-all ${
                      bar.orders > 100
                        ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50'
                        : 'bg-emerald-600/70'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{bar.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
