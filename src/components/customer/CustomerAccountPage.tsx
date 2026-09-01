import React, { useState } from 'react';
import {
  User,
  MapPin,
  Heart,
  Package,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Bell,
  CreditCard,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CustomerAccountPageProps {
  onNavigateOrders: () => void;
  onNavigateWishlist: () => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  onNavigateOrders,
  onNavigateWishlist,
}) => {
  const { user, setUser, wishlist, orders, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'preferences'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-5678');
  
  // Address states
  const [streetAddress, setStreetAddress] = useState(user.address?.streetAddress || '742 Evergreen Terrace');
  const [aptSuite, setAptSuite] = useState(user.address?.aptSuite || 'Suite 4B');
  const [city, setCity] = useState(user.address?.city || 'Springfield');
  const [postalCode, setPostalCode] = useState(user.address?.postalCode || '97477');
  const [deliveryNotes, setDeliveryNotes] = useState(user.address?.deliveryInstructions || 'Leave near front door.');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      phone,
    });
    showToast('Profile information updated successfully!', 'success');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      address: {
        fullName: name,
        phone,
        streetAddress,
        aptSuite,
        city,
        postalCode,
        deliveryInstructions: deliveryNotes,
      },
    });
    showToast('Delivery address saved!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Account Overview Top Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-600/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0E1116] tracking-tight">{user.name}</h1>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                24/7 Mart Plus Member
              </span>
              <span className="text-[11px] text-slate-400 font-mono-num">{orders.length} total orders</span>
            </div>
          </div>
        </div>

        {/* Quick links buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateOrders}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={onNavigateWishlist}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs and Form Content */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex border-b border-slate-100 gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'addresses'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Delivery Addresses
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'preferences'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notifications & Security
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apt / Suite</label>
                <input
                  type="text"
                  value={aptSuite}
                  onChange={(e) => setAptSuite(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Courier Instructions
              </label>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Update Saved Address</span>
              </button>
            </div>
          </form>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="space-y-4 max-w-xl text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-[#0E1116] flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Delivery Alerts & Updates</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                <span>SMS updates when courier is on the way (25–35 min window)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                <span>Email order receipts and invoice breakdown</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                <span>Notify me when flash deals and midnight discounts launch</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
