import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateCheckout,
  onNavigateShop,
}) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    deliveryFee,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    storeSettings,
    appliedPromoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const threshold = storeSettings.freeDeliveryThreshold;
  const awayFromFree = Math.max(0, threshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / threshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyPromoCode(couponInput.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0E1116]">Your Cart</h3>
              <p className="text-xs text-slate-500 font-medium">{cartCount} items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {awayFromFree > 0 ? (
              <span className="text-slate-700">
                Add <strong className="text-emerald-600 font-mono-num">${awayFromFree.toFixed(2)}</strong> more for <strong>FREE Delivery</strong>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Unlocked FREE Fast Delivery!
              </span>
            )}
            <span className="font-mono-num text-[11px] text-slate-400 font-medium">
              ${threshold.toFixed(0)} Goal
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">Your cart is waiting</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Add your favorite groceries, snacks, cold beverages & daily essentials.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateShop();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {item.product.brand}
                  </span>
                  <h5 className="font-semibold text-xs text-[#0E1116] truncate">
                    {item.product.name}
                  </h5>
                  <span className="text-[11px] text-slate-500">
                    {item.product.sizeWeight}
                  </span>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono-num font-bold text-xs text-[#0E1116]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-num font-bold text-xs px-2 min-w-[20px] text-center text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-slate-600 disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-300 hover:text-rose-500 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
            {/* Promo Code Input */}
            {!appliedPromoCode ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon (e.g. MART24)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon <strong>{appliedPromoCode}</strong> applied (-${promoDiscount.toFixed(2)})</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-slate-400 hover:text-rose-600 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono-num font-medium text-slate-800">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono-num">-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono-num font-medium text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Estimated Tax ({storeSettings.taxRatePercent}%)</span>
                <span className="font-mono-num">
                  ${(cartSubtotal * (storeSettings.taxRatePercent / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0E1116] pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="font-mono-num text-base text-emerald-700">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onNavigateCheckout();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
