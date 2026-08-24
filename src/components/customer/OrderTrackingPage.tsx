import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Bike,
  Home,
  Phone,
  MessageCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Printer,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { DeliveryRouteMap } from './DeliveryRouteMap';

interface OrderTrackingPageProps {
  orderId?: string;
  onNavigateOrders: () => void;
  onNavigateShop: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    status: 'placed',
    label: 'Order Placed',
    desc: 'Order received and payment confirmed.',
    icon: Package,
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    desc: 'Order verified by 24/7 Mart dispatch.',
    icon: CheckCircle2,
  },
  {
    status: 'preparing',
    label: 'Packing Items',
    desc: 'Specialist selecting fresh chilled goods.',
    icon: Clock,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'Courier on electric scooter speeding your way.',
    icon: Bike,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    desc: 'Package handed over at your doorstep.',
    icon: Home,
  },
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onNavigateOrders,
  onNavigateShop,
}) => {
  const { orders, updateOrderStatus, openReceiptModal, showToast } = useStore();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(currentOrder ? currentOrder.status : 'out_for_delivery');
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (currentOrder) {
      setActiveStatus(currentOrder.status);
    }
  }, [currentOrder]);

  // Status index
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === activeStatus);

  const handleSimulateNextStep = async () => {
    if (!currentOrder) return;
    const nextIndex = (currentStepIndex + 1) % STATUS_STEPS.length;
    const nextStatus = STATUS_STEPS[nextIndex].status;
    setActiveStatus(nextStatus);
    await updateOrderStatus(currentOrder.id, nextStatus);
    showToast(`Order status updated to: ${STATUS_STEPS[nextIndex].label}`, 'info');
  };

  if (!currentOrder) {
    return (
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-12 text-center max-w-lg mx-auto shadow-xs my-8 space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">No active order to track</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">You haven't placed an order in this session yet.</p>
        <button
          onClick={onNavigateShop}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full w-max mb-1.5 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live 24/7 GPS Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] dark:text-white tracking-tight">
            Order #{currentOrder.orderNumber}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Placed on {new Date(currentOrder.createdAt).toLocaleDateString()} at{' '}
            {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openReceiptModal(currentOrder)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-colors"
            title="Print clean receipt"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleSimulateNextStep}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 text-xs font-bold shadow-xs transition-colors"
            title="Advance order to next state for simulation"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
            <span>Advance Status Demo</span>
          </button>
        </div>
      </div>

      {/* Real-Time Stepper Progress */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-6 sm:p-8 shadow-xs space-y-8">
        {/* Status Highlights Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Current Status
              </span>
              <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                {STATUS_STEPS[currentStepIndex]?.label || 'In Progress'}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                {STATUS_STEPS[currentStepIndex]?.desc}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Estimated Delivery Time
            </span>
            <span className="font-bold text-xl sm:text-2xl text-[#0E1116] dark:text-white block mt-0.5">
              {activeStatus === 'delivered' ? 'Delivered Just Now' : `${etaMinutes} Minutes`}
            </span>
          </div>
        </div>

        {/* Stepper Line */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {STATUS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.status}
                className={`relative flex sm:flex-col items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 dark:border-[#21262D] bg-slate-50/50 dark:bg-[#0E1116]/50'
                    : 'border-slate-100 dark:border-slate-800 opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-left sm:text-center min-w-0">
                  <h4 className="font-bold text-xs text-[#0E1116] dark:text-white leading-tight truncate">
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block line-clamp-2">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Delivery Route Map */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-6 pb-2 border-b border-slate-100 dark:border-[#21262D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-[#0E1116] dark:text-white">Interactive Delivery Route</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click map waypoints for courier telemetry, warehouse origin, and destination notes
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            Live 25-min Express
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <DeliveryRouteMap order={currentOrder} activeStatus={activeStatus} />
        </div>

        {/* Courier Contact Strip */}
        <div className="p-6 bg-slate-50/50 dark:bg-[#0E1116]/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-[#21262D]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-base">
              CR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#0E1116] dark:text-white">Carlos Rodriguez</h4>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ★ 4.98 (840+ deliveries)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                24/7 Mart Eco-Express Courier • Green Electric Scooter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => showToast('Calling courier Carlos Rodriguez at +1 (555) 019-2831...', 'info')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Courier</span>
            </button>
            <button
              onClick={() => showToast('Opening instant SMS chat with courier...', 'info')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#1F2530] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#21262D] font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Items Breakdown & Navigation */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#0E1116] dark:text-white">Items in this Delivery</h3>
        <div className="space-y-2">
          {currentOrder.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-[#21262D] text-xs bg-slate-50/50 dark:bg-[#0E1116]/50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-[#161B22] p-1 object-contain shrink-0 border border-slate-200 dark:border-[#21262D]"
                />
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-white">{item.name}</h5>
                  <span className="text-slate-500 dark:text-slate-400 font-mono-num">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="font-mono-num font-bold text-slate-900 dark:text-emerald-400">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#21262D]">
          <button
            onClick={onNavigateOrders}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            ← View All Orders
          </button>
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            Shop More Essentials →
          </button>
        </div>
      </div>
    </div>
  );
};
