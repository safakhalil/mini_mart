import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';

interface CategoriesPageProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { categories } = useStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Store Aisles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] tracking-tight">
          Explore All Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Browse through all 12 convenience and grocery departments. Over 240+ premium products stocked and ready for immediate delivery.
        </p>
      </div>

      {/* Grid of 12 Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:border-emerald-300 cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Category Badge */}
            {category.badge && (
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-[#0E1116]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                  {category.badge}
                </span>
              </div>
            )}

            {/* Category Image */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Information */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#0E1116] group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {category.itemCount} items
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* CTA bottom */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
              <span>Browse Aisle</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
