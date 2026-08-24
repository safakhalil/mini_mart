import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onViewAllResults: (query: string) => void;
}

const POPULAR_SEARCHES = ['Coca-Cola', 'Milk', 'Eggs', 'Potato Chips', 'Ice Cream', 'Bread', 'Water', 'Coffee'];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewAllResults,
}) => {
  const { products, addToCart, getCartQuantity } = useStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('247mart_recent_searches');
      return saved ? JSON.parse(saved) : ['Snacks', 'Chilled Drinks', 'Fresh Fruit'];
    } catch {
      return ['Snacks', 'Chilled Drinks', 'Fresh Fruit'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSearchSubmit = (searchWord: string) => {
    if (!searchWord.trim()) return;
    const updated = [searchWord, ...recentSearches.filter((s) => s.toLowerCase() !== searchWord.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('247mart_recent_searches', JSON.stringify(updated));
    } catch {}
    onViewAllResults(searchWord);
    onClose();
  };

  const handleProductClick = (product: Product) => {
    onSelectProduct(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Search groceries, cold drinks, snacks, dairy, household..."
            className="flex-1 text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Content */}
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="space-y-5">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchSubmit(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                      >
                        <span>{item}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Trending & Popular</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-xs font-medium transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  {filteredProducts.length} items found for "{query}"
                </span>
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredProducts.slice(0, 6).map((prod) => {
                  const inCartQty = getCartQuantity(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-all group"
                    >
                      <div className="w-14 h-14 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                          {prod.brand} • {prod.sizeWeight}
                        </span>
                        <h5 className="font-semibold text-xs text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                          {prod.name}
                        </h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono-num font-bold text-xs text-[#0E1116]">
                            ${prod.price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(prod, 1);
                            }}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md"
                          >
                            {inCartQty > 0 ? `In Cart (${inCartQty})` : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No products found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                We couldn't find anything matching "{query}". Try checking for spelling or searching for a category like "Drinks" or "Snacks".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
