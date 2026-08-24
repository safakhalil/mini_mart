import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Star,
  ShoppingBag,
  Sparkles,
  Layers,
  Scale,
  Minus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    products,
    compareList,
    removeFromCompare,
    clearCompare,
    addToCart,
    addToCompare,
    getCartQuantity,
    openBackInStockModal,
  } = useStore();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectedAddId, setSelectedAddId] = useState('');

  if (!isOpen) return null;

  // Available products not already in comparison
  const availableToAdd = products.filter(
    (p) => !compareList.some((c) => c.id === p.id)
  );

  // Helper to check if a property differs across the compared products
  const hasDifference = (extractor: (p: Product) => any) => {
    if (compareList.length <= 1) return false;
    const firstVal = extractor(compareList[0]);
    return compareList.some((p) => extractor(p) !== firstVal);
  };

  const handleAddSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const found = products.find((p) => p.id === id);
    if (found) {
      addToCompare(found);
      setSelectedAddId('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-200 dark:border-[#21262D] w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#21262D] flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0E1116]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0E1116] dark:text-white">
                  Side-by-Side Product Comparison
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {compareList.length} of 4 items
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare price, customer ratings, ingredients, and full nutritional facts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 1 && (
              <button
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  highlightDifferences
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-slate-100 dark:bg-[#1F2530] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#21262D] hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Highlight Differences</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1F2530] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {compareList.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#1F2530] text-slate-400 mx-auto flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  No products selected for comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click the "Compare" button on any product in the shop catalog to analyze specs side-by-side.
                </p>
              </div>
              {availableToAdd.length > 0 && (
                <div className="max-w-xs mx-auto pt-2">
                  <select
                    value={selectedAddId}
                    onChange={handleAddSelect}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1116] border border-slate-200 dark:border-[#21262D] text-slate-800 dark:text-slate-200"
                  >
                    <option value="">+ Add a product to compare...</option>
                    {availableToAdd.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Comparison Grid Table */}
              <table className="w-full border-collapse text-left text-xs min-w-[640px]">
                <thead>
                  <tr>
                    <th className="p-3 w-48 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-[#0E1116]/50 rounded-tl-2xl">
                      Product Overview
                    </th>
                    {compareList.map((product) => (
                      <th
                        key={product.id}
                        className="p-3 font-normal min-w-[200px] align-top bg-slate-50/50 dark:bg-[#0E1116]/50 first:rounded-none last:rounded-tr-2xl relative"
                      >
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-[#1F2530]"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-2 pt-2">
                          <div className="w-24 h-24 rounded-2xl bg-white dark:bg-[#0E1116] p-2 border border-slate-200 dark:border-[#21262D] flex items-center justify-center">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              {product.brand}
                            </span>
                            <h4 className="font-bold text-xs text-[#0E1116] dark:text-white line-clamp-2 max-w-[180px] mt-0.5">
                              {product.name}
                            </h4>
                          </div>

                          {/* Quick Add to Cart */}
                          <div className="w-full pt-1">
                            {product.stock <= 0 ? (
                              <button
                                onClick={() => openBackInStockModal(product)}
                                className="w-full py-1.5 px-2 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] font-semibold"
                              >
                                Notify When Available
                              </button>
                            ) : (
                              <button
                                onClick={() => addToCart(product, 1)}
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-colors shadow-xs"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Placeholder Slot if <4 items */}
                    {compareList.length < 4 && (
                      <th className="p-3 w-48 align-middle text-center bg-slate-50/20 dark:bg-[#0E1116]/20 border border-dashed border-slate-200 dark:border-[#21262D] rounded-2xl">
                        <div className="space-y-2 p-2">
                          <Plus className="w-6 h-6 text-slate-400 mx-auto" />
                          <p className="text-[11px] text-slate-500 font-medium">Add Product</p>
                          <select
                            value={selectedAddId}
                            onChange={handleAddSelect}
                            className="w-full text-[11px] font-medium p-1.5 rounded-lg bg-white dark:bg-[#0E1116] border border-slate-200 dark:border-[#21262D] text-slate-700 dark:text-slate-300"
                          >
                            <option value="">Select item...</option>
                            {availableToAdd.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#21262D]">
                  {/* Section Header: Pricing & Rating */}
                  <tr className="bg-slate-100/60 dark:bg-[#1F2530]/60">
                    <td
                      colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)}
                      className="px-4 py-2 font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Pricing & Customer Ratings
                    </td>
                  </tr>

                  {/* Category */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.categoryId)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                      Category
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize bg-slate-100 dark:bg-[#1F2530] px-2 py-0.5 rounded-md text-[11px]">
                          {p.categoryId.replace('-', ' ')}
                        </span>
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Price */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.price)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                      Price & Discount
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono-num font-bold text-sm text-[#0E1116] dark:text-white">
                            ${p.price.toFixed(2)}
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ${p.originalPrice.toFixed(2)}
                            </span>
                          )}
                          {p.discountPercent ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              {p.discountPercent}% OFF
                            </span>
                          ) : null}
                        </div>
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Rating */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.rating)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                      Rating & Reviews
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-lg text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                            <span>{p.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            ({p.reviewCount} reviews)
                          </span>
                        </div>
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Size & Weight */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.sizeWeight)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                      Portion / Size
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-slate-800 dark:text-slate-200">
                        {p.sizeWeight}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Availability */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.stock > 0)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">
                      Availability
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.stock <= 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px] bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                            In Stock ({p.stock} units)
                          </span>
                        )}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Section Header: Nutritional Facts */}
                  <tr className="bg-slate-100/60 dark:bg-[#1F2530]/60">
                    <td
                      colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)}
                      className="px-4 py-2 font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Nutritional Facts (Per Serving)
                    </td>
                  </tr>

                  {/* Calories */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.calories)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Calories</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num font-bold text-slate-800 dark:text-slate-200">
                        {p.nutrition?.calories || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Protein */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.protein)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Protein</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num text-slate-800 dark:text-slate-200">
                        {p.nutrition?.protein || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Carbs */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.carbs)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Carbohydrates</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num text-slate-800 dark:text-slate-200">
                        {p.nutrition?.carbs || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Fat */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.fat)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Total Fat</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num text-slate-800 dark:text-slate-200">
                        {p.nutrition?.fat || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Sugar */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.sugar)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Sugar</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num text-slate-800 dark:text-slate-200">
                        {p.nutrition?.sugar || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Sodium */}
                  <tr
                    className={
                      highlightDifferences && hasDifference((p) => p.nutrition?.sodium)
                        ? 'bg-amber-50/60 dark:bg-amber-950/30'
                        : ''
                    }
                  >
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Sodium</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono-num text-slate-800 dark:text-slate-200">
                        {p.nutrition?.sodium || '—'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Serving Size */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Serving Size</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700 dark:text-slate-300">
                        {p.nutrition?.servingSize || p.sizeWeight || '1 serving'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>

                  {/* Ingredients */}
                  <tr className="bg-slate-100/60 dark:bg-[#1F2530]/60">
                    <td
                      colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)}
                      className="px-4 py-2 font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Ingredients & Tags
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Ingredients</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {p.ingredients || 'Natural ingredients. See packaging for full dietary declaration.'}
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Tags</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-slate-100 dark:bg-[#1F2530] text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                    {compareList.length < 4 && <td className="p-3"></td>}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#21262D] bg-slate-50/50 dark:bg-[#0E1116]/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {compareList.length} product(s) selected • Maximum 4
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
