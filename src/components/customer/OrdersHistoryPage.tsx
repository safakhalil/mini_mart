import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Bike,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface OrdersHistoryPageProps {
  onTrackOrder: (orderId: string) => void;
  onNavigateShop: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: any }> = {
  placed: { label: 'Order Placed', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Package },
  pending: { label: 'Order Placed', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Package },
  confirmed: { label: 'Confirmed', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', icon: CheckCircle2 },
  preparing: { label: 'Packing Items', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: Bike },
  out_of_delivery: { label: 'Out for Delivery', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: Bike },
  delivered: { label: 'Delivered', bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: RotateCcw },
};

export const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({
  onTrackOrder,
  onNavigateShop,
}) => {
  const { orders, reorderPastOrder, openReceiptModal, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status);
    if (filter === 'completed') return ['delivered', 'cancelled'].includes(o.status);
    return true;
  });

  const handleReorder = (order: Order) => {
    reorderPastOrder(order.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track active deliveries and review your past groceries & convenience orders
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">No orders found</h3>
            <p className="text-xs text-slate-500 mt-1">You don't have any orders under this filter.</p>
          </div>
          <button
            onClick={onNavigateShop}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
            const StatusIcon = statusConfig.icon;
            const isActive = ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:border-slate-200 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num font-bold text-sm text-[#0E1116]">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Amount</span>
                    <span className="font-mono-num font-bold text-base text-[#0E1116]">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded bg-white object-contain p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                        <span className="text-slate-400 text-[11px]">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    <span>Delivered to: <strong>{order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openReceiptModal(order)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-700" />
                      <span>Print Receipt</span>
                    </button>

                    {isActive ? (
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Track Live Delivery</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
