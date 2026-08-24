import React from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings } = useStore();

  return (
    <div className="bg-[#0E1116] text-white text-xs py-2 px-4 border-b border-[#1F2530] select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            OPEN 24/7
          </span>
          <span className="hidden sm:inline text-slate-300">
            {storeSettings.announcementText}
          </span>
          <span className="sm:hidden text-slate-300">
            Fast Delivery in 25–35 Mins
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Use code <strong className="text-emerald-400 font-mono">MART24</strong> for 20% OFF</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Fresh Guarantee</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free delivery over ${storeSettings.freeDeliveryThreshold.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
