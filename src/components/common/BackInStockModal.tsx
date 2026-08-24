import React, { useState, useEffect } from 'react';
import { Bell, X, Mail, CheckCircle2, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BackInStockModal: React.FC = () => {
  const {
    isBackInStockModalOpen,
    setIsBackInStockModalOpen,
    backInStockProduct,
    user,
    requestBackInStock,
    showToast,
  } = useStore();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enableSms, setEnableSms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isBackInStockModalOpen) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isBackInStockModalOpen, user]);

  if (!isBackInStockModalOpen || !backInStockProduct) return null;

  const product = backInStockProduct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestBackInStock(product.id, email, enableSms ? phone : undefined);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsBackInStockModalOpen(false);
      }, 2500);
    } catch {
      showToast('Error registering alert. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsBackInStockModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0E1116] tracking-tight">
              Back in Stock Notification
            </h3>
            <p className="text-xs text-slate-500">
              Get notified immediately when this grocery item is restocked.
            </p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                {product.brand}
              </span>
              <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                Out of Stock
              </span>
            </div>
            <h4 className="text-xs font-semibold text-[#0E1116] truncate leading-tight">
              {product.name}
            </h4>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500 text-[11px]">{product.sizeWeight}</span>
              <span className="font-mono-num font-bold text-slate-900">${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-200 space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-emerald-900">You're on the priority list!</h4>
            <p className="text-xs text-emerald-700 max-w-xs mx-auto">
              We'll send an instant email to <strong className="font-semibold">{email}</strong> the second 24/7 Mart receives fresh inventory.
            </p>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Optional Phone / SMS notification */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={enableSms}
                  onChange={(e) => setEnableSms(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <span>Also send me an instant SMS text alert</span>
              </label>

              {enableSms && (
                <div className="relative animate-in fade-in duration-150">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>We never spam or sell your info. You'll only receive one restock notification for this item.</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBackInStockModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Registering...' : 'Email Me When Back'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
