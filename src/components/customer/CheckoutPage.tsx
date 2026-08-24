import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Lock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DeliveryAddress, PaymentMethod } from '../../types';

interface CheckoutPageProps {
  onSuccess: (orderId: string) => void;
  onBackToCart: () => void;
  onNavigateShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onSuccess,
  onBackToCart,
  onNavigateShop,
}) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    deliveryFee,
    appliedPromoCode,
    promoDiscount,
    storeSettings,
    user,
    setUser,
    placeOrder,
    showToast,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery Form State
  const [addressForm, setAddressForm] = useState<DeliveryAddress>({
    fullName: user.address?.fullName || user.name || '',
    phone: user.address?.phone || user.phone || '',
    streetAddress: user.address?.streetAddress || '',
    aptSuite: user.address?.aptSuite || '',
    city: user.address?.city || 'Springfield',
    postalCode: user.address?.postalCode || '97477',
    deliveryInstructions: user.address?.deliveryInstructions || 'Leave near doorstep and ring bell.',
  });

  const [saveAddress, setSaveAddress] = useState(true);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVC, setCardCVC] = useState('888');

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4 my-8">
        <h3 className="font-bold text-lg text-slate-800">Your cart is empty</h3>
        <p className="text-xs text-slate-500">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={onNavigateShop}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.streetAddress || !addressForm.phone) {
      showToast('Please fill in required address fields', 'error');
      return;
    }
    if (saveAddress) {
      setUser({
        ...user,
        name: addressForm.fullName,
        phone: addressForm.phone,
        address: addressForm,
      });
    }
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePlaceFinalOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        deliveryAddress: addressForm,
        paymentMethod,
      });
      onSuccess(order.id);
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Checkout Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep >= 1
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <span
              className={`text-[11px] font-bold ${
                currentStep >= 1 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              Delivery
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep >= 2
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <span
              className={`text-[11px] font-bold ${
                currentStep >= 2 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              Payment
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep >= 3
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span
              className={`text-[11px] font-bold ${
                currentStep >= 3 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              Review
            </span>
          </div>
        </div>
      </div>

      {/* Main Checkout Form + Summary Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
          {/* STEP 1: DELIVERY ADDRESS */}
          {currentStep === 1 && (
            <form onSubmit={handleDeliverySubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[#0E1116]">Delivery Details</h2>
                    <p className="text-xs text-slate-500">Estimated delivery: 25–35 minutes</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apt / Suite
                  </label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    value={addressForm.aptSuite || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, aptSuite: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Instructions / Notes for Driver */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Delivery Instructions for Driver
                  </label>
                  <span className="text-[11px] text-slate-400">Optional</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave at front door, gate code #4492, buzzer 12B, or call when arriving..."
                  value={addressForm.deliveryInstructions || ''}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, deliveryInstructions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                />
                {/* Preset quick buttons */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {[
                    'Leave at front door',
                    'Ring doorbell upon delivery',
                    'Call when at gate/entrance',
                    'Leave with building concierge',
                    'Beware of dog',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const current = addressForm.deliveryInstructions || '';
                        if (!current.includes(preset)) {
                          const updated = current ? `${current}, ${preset}` : preset;
                          setAddressForm({ ...addressForm, deliveryInstructions: updated });
                        }
                      }}
                      className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none pt-1">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <span>Save this address for 1-click ordering next time</span>
              </label>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 transition-colors"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {currentStep === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[#0E1116]">Payment Method</h2>
                    <p className="text-xs text-slate-500">256-bit encrypted secure checkout</p>
                  </div>
                </div>
              </div>

              {/* Method Choices */}
              <div className="space-y-3">
                {/* Credit Card Option */}
                <div
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-xs text-[#0E1116]">Credit / Debit Card</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      Visa • MC • Amex
                    </span>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            CVC / CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash On Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-xs text-[#0E1116] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Pay cash or contactless card when courier arrives
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Wallet Option */}
                <div
                  onClick={() => setPaymentMethod('digital_wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'digital_wallet'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-xs text-[#0E1116] block">
                          Digital Wallet / Instant Pay
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Apple Pay, Google Pay, UPI instant authorization
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 transition-colors"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER REVIEW & PLACE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[#0E1116]">Review and Confirm</h2>
                    <p className="text-xs text-slate-500">Double check items & delivery address</p>
                  </div>
                </div>
              </div>

              {/* Delivery Destination Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Delivering To: {addressForm.fullName}</span>
                  </span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-emerald-600 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-slate-600 pl-5">
                  {addressForm.streetAddress} {addressForm.aptSuite ? `, ${addressForm.aptSuite}` : ''}, {addressForm.city}, {addressForm.postalCode}
                </p>
                <p className="text-slate-500 pl-5 text-[11px]">Phone: {addressForm.phone}</p>
                {addressForm.deliveryInstructions && (
                  <p className="text-slate-500 pl-5 text-[11px] italic">
                    Note: "{addressForm.deliveryInstructions}"
                  </p>
                )}
              </div>

              {/* Payment Method Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>
                    Payment:{' '}
                    {paymentMethod === 'credit_card'
                      ? 'Credit Card (ending 4242)'
                      : paymentMethod === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : 'Digital Wallet'}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-emerald-600 hover:underline font-semibold"
                >
                  Edit
                </button>
              </div>

              {/* Cart Items Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Items ({cart.length})
                </span>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain rounded bg-slate-50 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                          <span className="text-[11px] text-slate-500 font-mono-num">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono-num font-bold text-slate-900 shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Payment</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceFinalOrder}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Placing Order...' : `Place Order • $${cartTotal.toFixed(2)}`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-5 sticky top-24">
          <h3 className="font-bold text-base text-[#0E1116] pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-mono-num font-semibold text-slate-800">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon Discount ({appliedPromoCode})</span>
                </span>
                <span className="font-mono-num">-${promoDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Fast 24/7 Delivery Fee</span>
              <span className="font-mono-num font-semibold text-slate-800">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `$${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Estimated Sales Tax ({storeSettings.taxRatePercent}%)</span>
              <span className="font-mono-num">
                ${(cartSubtotal * (storeSettings.taxRatePercent / 100)).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-[#0E1116] pt-3 border-t border-slate-100">
              <span>Grand Total</span>
              <span className="font-mono-num text-xl text-emerald-700">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Doorstep Delivery in 25–35 Mins</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Packed fresh in temperature-controlled bags by 24/7 Mart specialists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
