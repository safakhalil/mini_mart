import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-100 dark:border-[#21262D] p-3.5 sm:p-4 flex flex-col justify-between animate-pulse">
      {/* Top badges placeholder */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="flex gap-1">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>

      {/* Image box placeholder */}
      <div className="aspect-square w-full rounded-xl bg-slate-100 dark:bg-[#0E1116] mb-3 flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60"></div>
      </div>

      {/* Details placeholder */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-14 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>

        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>

        {/* Rating placeholder */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-4 w-10 bg-amber-100/60 dark:bg-amber-950/40 rounded"></div>
          <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#21262D]">
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-8 w-16 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const ShopGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
