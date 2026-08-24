import React, { useState } from 'react';
import { Settings, Save, Store, Truck, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, showToast } = useStore();

  const [name, setName] = useState(storeSettings.storeName);
  const [tagline, setTagline] = useState(storeSettings.tagline);
  const [phone, setPhone] = useState(storeSettings.supportPhone);
  const [email, setEmail] = useState(storeSettings.supportEmail);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(storeSettings.freeDeliveryThreshold);
  const [deliveryFee, setDeliveryFee] = useState(storeSettings.deliveryFee);
  const [taxRatePercent, setTaxRatePercent] = useState(storeSettings.taxRatePercent);
  const [isOpen24Hours, setIsOpen24Hours] = useState(storeSettings.isOpen24Hours);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateStoreSettings({
      storeName: name,
      tagline,
      supportPhone: phone,
      supportEmail: email,
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      deliveryFee: Number(deliveryFee),
      taxRatePercent: Number(taxRatePercent),
      isOpen24Hours,
    });
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Store Configurations</h1>
          <p className="text-xs text-slate-400">
            Global delivery thresholds, sales tax rates, contact channels and 24/7 store operational state.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 shadow-xl">
        {/* Basic Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-white text-sm">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Store Identity & Tagline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Official Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-white text-sm">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Support & Hotline Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">24/7 Hotline Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Tax Parameters */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-white text-sm">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Delivery & Tax Calculations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Free Delivery Threshold ($)
              </label>
              <input
                type="number"
                step="1"
                required
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Standard Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Store Operational State */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOpen24Hours}
              onChange={(e) => setIsOpen24Hours(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 accent-emerald-600"
            />
            <div>
              <span className="font-bold text-white text-xs block">
                Enable 24/7 Round-the-Clock Online Ordering
              </span>
              <span className="text-[11px] text-slate-400">
                Customers can place orders anytime day or night for 25–35 min courier dispatch.
              </span>
            </div>
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
