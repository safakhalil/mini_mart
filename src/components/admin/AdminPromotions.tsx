import React, { useState } from 'react';
import { Tag, Plus, Check, X, Percent, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Promotion } from '../../types';

export const AdminPromotions: React.FC = () => {
  const { promotions, addPromotion, togglePromotion, showToast } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(20);
  const [minSpend, setMinSpend] = useState(25);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    await addPromotion({
      code: code.trim().toUpperCase(),
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      isActive: true,
      validUntil,
      usageCount: 0,
    });

    setIsAddModalOpen(false);
    setCode('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Discounts & Promotions</h1>
          <p className="text-xs text-slate-400">
            Create coupon codes, flash sale banners and threshold discounts for 24/7 Mart shoppers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  {promo.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    promo.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {promo.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm">{promo.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{promo.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Discount Value:</span>
                <span className="font-bold text-white">
                  {promo.discountType === 'percent' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min Order Spend:</span>
                <span className="font-bold text-white font-mono-num">${promo.minSpend.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Times Used:</span>
                <span className="font-bold text-emerald-400 font-mono-num">{promo.usageCount} orders</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Valid Until:</span>
                <span>{promo.validUntil}</span>
              </div>

              <button
                onClick={() => togglePromotion(promo.id)}
                className={`w-full py-2 rounded-xl font-bold text-xs transition-colors ${
                  promo.isActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {promo.isActive ? 'Pause Promotion' : 'Activate Promotion'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Promotion Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Create New Promo Coupon</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Promotion Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% Off Midnight Snacks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Applies to all drinks and snack items."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
