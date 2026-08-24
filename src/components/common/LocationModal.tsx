import React, { useState } from 'react';
import { MapPin, Check, Plus, Home, Briefcase, Navigation, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ADDRESSES = [
  {
    label: 'Home • 742 Evergreen Terr',
    address: '742 Evergreen Terrace, Apt 4B, Springfield, 97477',
    icon: Home,
    type: 'Home',
  },
  {
    label: 'Work • Metro Financial Tower',
    address: '100 Wall Street, Floor 14, Financial District, 10005',
    icon: Briefcase,
    type: 'Work',
  },
  {
    label: 'Gym • City Athletics Club',
    address: '450 Broadway Ave, Downtown, 90014',
    icon: Navigation,
    type: 'Other',
  },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { selectedLocation, setSelectedLocation, showToast } = useStore();
  const [customAddress, setCustomAddress] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (loc: { label: string; address: string }) => {
    setSelectedLocation(loc);
    showToast(`Delivery location updated to ${loc.label}`, 'success');
    onClose();
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    const newLoc = {
      label: customLabel.trim() || 'Custom Location',
      address: customAddress.trim(),
    };
    setSelectedLocation(newLoc);
    showToast('Delivery location updated', 'success');
    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#0E1116]">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg">Select Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2 mb-4">
          Choose where you would like your 24/7 Mart groceries and essentials delivered in 25–35 minutes.
        </p>

        {!isAddingNew ? (
          <div className="space-y-2.5">
            {PRESET_ADDRESSES.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedLocation.address === item.address;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#0E1116]">{item.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.address}</p>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full mt-3 py-2.5 px-4 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50/30 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveCustom} className="space-y-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Label (e.g., Beach House, Mom's Place)
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Beach House"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Street Address & Unit
              </label>
              <textarea
                required
                rows={2}
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="123 Ocean Blvd, Apt 5, City, Zip"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Set Location
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
