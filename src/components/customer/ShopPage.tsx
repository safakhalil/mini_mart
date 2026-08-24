import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  Star,
  Zap,
  RotateCcw,
  Scale,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { ProductCardSkeleton } from '../common/ProductCardSkeleton';
import { ProductComparisonModal } from '../common/ProductComparisonModal';
import { ProductComparisonDock } from '../common/ProductComparisonDock';
import { CategoryId, Product } from '../../types';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onQuickView: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  initialSearch = '',
  onQuickView,
  onSelectProduct,
}) => {
  const {
    products,
    categories,
    isLoading,
    compareList,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isGridLoading, setIsGridLoading] = useState(false);

  // Available unique brands
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Price Range
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // In Stock
      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      // Discount
      if (onlyDiscounted && (!p.discountPercent || p.discountPercent <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    minPrice,
    maxPrice,
    selectedBrands,
    minRating,
    onlyInStock,
    onlyDiscounted,
    sortBy,
  ]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(30);
    setSelectedBrands([]);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minPrice > 0 || maxPrice < 30 ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyDiscounted ? 1 : 0);

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Shop</span>
            <span>/</span>
            <span className="text-emerald-600 font-semibold">
              {selectedCategoryObj ? selectedCategoryObj.name : 'All Products'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] tracking-tight">
            {selectedCategoryObj ? selectedCategoryObj.name : 'All Products & Groceries'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredProducts.length} items available for fast 24/7 delivery
          </p>
        </div>

        {/* Search inside shop */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in products..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFiltersCount})</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#0E1116]">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filter Products</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Categories
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[11px] text-slate-400">{products.length}</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] text-slate-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Price Range
              </label>
              <span className="font-mono-num text-xs font-bold text-slate-700">
                ${minPrice} - ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Availability & Deals toggles */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Offers & Stock
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="flex items-center gap-1">
                <span>On Sale / Deals Only</span>
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
              </span>
            </label>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Brands ({allBrands.length})
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {allBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Customer Rating
            </label>
            <div className="space-y-1">
              {[4, 3, 0].map((starVal) => (
                <button
                  key={starVal}
                  onClick={() => setMinRating(starVal === minRating ? 0 : starVal)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    minRating === starVal
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {starVal === 0 ? (
                    <span>All Ratings</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < starVal ? 'fill-amber-400 stroke-amber-500' : 'stroke-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px]">& Up</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Product Grid & Sorting */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Active Filters pills & Sorting Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Active filter badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span>{selectedCategoryObj?.name}</span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg"
                >
                  <span>{b}</span>
                  <button onClick={() => handleBrandToggle(b)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {onlyDiscounted && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                  <span>On Sale</span>
                  <button onClick={() => setOnlyDiscounted(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFiltersCount === 0 && (
                <span className="text-xs text-slate-400">All available products</span>
              )}
            </div>

            {/* Sorting & Compare Button */}
            <div className="flex items-center gap-2 ml-auto">
              {compareList.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-xs"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({compareList.length})</span>
                </button>
              )}

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#21262D] text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid (Desktop: 4 cols, Tablet: 3 cols, Mobile: 2 cols) */}
          {isLoading || isGridLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={`skeleton-${idx}`} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-4 animate-in fade-in duration-200">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onNavigateDetails={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price filters, clearing brand selections, or searching for other everyday groceries.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm">Filters ({activeFiltersCount})</span>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="all">All Departments</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Max Price: ${maxPrice}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* In stock */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    className="rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>On Sale Only</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#21262D] flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#21262D] rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Comparison Dock */}
      <ProductComparisonDock />

      {/* Side-by-Side Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
};
