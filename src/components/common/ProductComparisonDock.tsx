import React from 'react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductComparisonDock: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    setIsCompareModalOpen,
  } = useStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#0E1116] dark:bg-[#161B22] text-white rounded-2xl p-3 sm:p-4 border border-[#21262D] shadow-2xl flex items-center justify-between gap-3 sm:gap-4 backdrop-blur-md">
        {/* Left count & icons */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white leading-none">
                Comparing Products
              </span>
              <span className="text-[10px] font-mono-num font-bold bg-emerald-600 px-1.5 py-0.5 rounded text-white">
                {compareList.length}/4
              </span>
            </div>

            {/* Thumbnail previews */}
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto py-0.5 max-w-[200px] sm:max-w-xs">
              {compareList.map((product) => (
                <div
                  key={product.id}
                  className="relative group w-8 h-8 rounded-lg bg-white p-0.5 border border-slate-700 shrink-0"
                  title={product.name}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear comparison"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
