import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Package,
  RotateCcw,
  Printer,
  Eye,
  MapPin,
  Phone,
  CreditCard,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.deliveryAddress.fullName.toLowerCase().includes(q) ||
        o.deliveryAddress.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, status });
    }
    showToast(`Order #${orderId} set to ${status}`, 'success');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Orders</h1>
          <p className="text-xs text-slate-400">
            Real-time fulfillment tracking, address verification and instant status dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {orders.length} Total Orders Recorded
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, or city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Status Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-900 rounded-xl text-xs font-bold">
          {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors capitalize ${
                statusFilter === st ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer & Address</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-white text-xs block">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-white text-xs">{order.deliveryAddress.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">
                      {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}
                    </p>
                  </td>

                  <td className="p-4 text-slate-400 font-mono-num">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </td>

                  <td className="p-4 font-mono-num font-bold text-white">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="p-4 text-[11px] text-slate-400 capitalize">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-hidden ${
                        order.status === 'delivered'
                          ? 'bg-slate-900 text-slate-400 border-slate-700'
                          : order.status === 'out_for_delivery'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : order.status === 'preparing'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Packing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Order Details
                </span>
                <h3 className="font-black text-xl text-white">
                  Order #{viewingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Destination & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                  Delivery Destination
                </span>
                <p className="font-bold text-white text-sm">{viewingOrder.deliveryAddress.fullName}</p>
                <p className="text-slate-300">
                  {viewingOrder.deliveryAddress.streetAddress}, {viewingOrder.deliveryAddress.aptSuite || ''}
                </p>
                <p className="text-slate-300">
                  {viewingOrder.deliveryAddress.city}, {viewingOrder.deliveryAddress.postalCode}
                </p>
                <p className="text-slate-400 pt-1">Phone: {viewingOrder.deliveryAddress.phone}</p>
                {viewingOrder.deliveryAddress.deliveryInstructions && (
                  <p className="text-emerald-400 italic pt-1">
                    "{viewingOrder.deliveryAddress.deliveryInstructions}"
                  </p>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">
                  Order & Payment Status
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-bold text-emerald-400 capitalize">
                    {viewingOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Payment:</span>
                  <span className="font-bold text-white capitalize">
                    {viewingOrder.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Date Placed:</span>
                  <span className="font-mono text-slate-300">
                    {new Date(viewingOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">
                Ordered Items
              </span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {viewingOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded bg-white p-1 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <span className="text-[11px] text-slate-400 font-mono-num">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono-num font-bold text-emerald-400 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono-num font-semibold text-slate-200">
                  ${viewingOrder.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee</span>
                <span className="font-mono-num font-semibold text-slate-200">
                  ${viewingOrder.deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span className="font-mono-num font-semibold text-slate-200">
                  ${viewingOrder.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="font-mono-num text-emerald-400 text-base">
                  ${viewingOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Packing Slip</span>
              </button>

              <button
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
