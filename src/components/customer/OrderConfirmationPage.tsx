import React from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Package,
  ShoppingBag,
  Sparkles,
  Phone,
  Printer,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface OrderConfirmationPageProps {
  orderId: string;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onTrackOrder,
  onContinueShopping,
}) => {
  const { orders, openReceiptModal } = useStore();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 pt-4">
      {/* Celebration Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-lg text-center space-y-5">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce duration-1000">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] tracking-tight">
            Thank you for ordering with 24/7 Mart!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your order <strong className="text-slate-800 font-mono">#{order ? order.orderNumber : orderId}</strong> has been received and our packing team is already getting it ready.
          </p>
        </div>

        {/* ETA Highlight */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 flex items-center justify-around text-center">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-700 text-base sm:text-lg mt-0.5">
              <Clock className="w-4 h-4" />
              <span>25–35 Minutes</span>
            </div>
          </div>
          <div className="h-8 w-px bg-emerald-200" />
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Amount Paid
            </span>
            <span className="font-mono-num font-black text-slate-900 text-base sm:text-lg mt-0.5 block">
              ${order ? order.total.toFixed(2) : '24.99'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onTrackOrder(order ? order.id : orderId)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Track Live Delivery Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {order && (
            <button
              onClick={() => openReceiptModal(order)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 active:scale-95 font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Print Receipt</span>
            </button>
          )}

          <button
            onClick={onContinueShopping}
            className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Preview */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0E1116]">Delivery Summary</h3>
            <span className="text-xs font-mono text-slate-400">ID: {order.id}</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">{order.deliveryAddress.fullName}</p>
                <p>{order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-slate-700">
                <span className="truncate pr-2">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-mono-num font-semibold text-slate-900 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
