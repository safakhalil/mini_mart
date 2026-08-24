import React from 'react';
import { Plus, Minus, Star, Heart, Eye, Bell, Scale, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onNavigateDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onNavigateDetails,
}) => {
  const {
    addToCart,
    updateQuantity,
    getCartQuantity,
    toggleWishlist,
    isInWishlist,
    openBackInStockModal,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useStore();

  const quantity = getCartQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-[#161B22] rounded-2xl border border-slate-100 dark:border-[#21262D] p-3.5 sm:p-4 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/40 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges & Wishlist / Compare actions */}
      <div className="flex items-center justify-between gap-1 mb-2 z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              {product.discountPercent}% OFF
            </span>
          ) : null}

          {isOutOfStock ? (
            <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
              Out of Stock
            </span>
          ) : product.stock <= product.lowStockThreshold ? (
            <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Compare Checkbox */}
          <label
            onClick={(e) => e.stopPropagation()}
            title={isCompared ? 'Remove from compare' : 'Select item to compare'}
            className={`flex items-center gap-1 cursor-pointer select-none px-1.5 py-0.5 rounded-lg border transition-all ${
              isCompared
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-50 dark:bg-[#0E1116] border-slate-200/60 dark:border-[#21262D] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <input
              type="checkbox"
              checked={isCompared}
              onChange={(e) => {
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(product.id);
                } else {
                  addToCompare(product);
                }
              }}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-[#161B22] cursor-pointer"
            />
            <span className="text-[10px] hidden sm:inline">
              Compare
            </span>
          </label>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick preview"
              className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#0E1116] hover:bg-slate-100 dark:hover:bg-[#1F2530] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isWishlisted
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
                : 'bg-slate-50 dark:bg-[#0E1116] text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-[#1F2530]'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-rose-500 stroke-rose-500' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div
        onClick={() => onNavigateDetails?.(product.id)}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0E1116] mb-3 cursor-pointer flex items-center justify-center"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        {/* Brand and size */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate max-w-[65%]">
            {product.brand}
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium shrink-0">
            {product.sizeWeight}
          </span>
        </div>

        {/* Product Name */}
        <h4
          onClick={() => onNavigateDetails?.(product.id)}
          className="font-semibold text-sm text-[#0E1116] dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer mb-2 leading-snug flex-1"
        >
          {product.name}
        </h4>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-700 dark:text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#21262D]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-num font-bold text-base text-[#0E1116] dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono-num text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart / Quantity Control / Out of Stock Alert */}
          {isOutOfStock ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openBackInStockModal(product);
              }}
              title="Email me when back in stock"
              className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors shadow-xs active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-none">Notify Me</span>
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center bg-emerald-600 text-white rounded-xl p-0.5 shadow-xs animate-in zoom-in-95 duration-150">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-700 active:scale-90 transition-transform"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="font-mono-num font-bold text-xs px-2 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                disabled={quantity >= product.stock}
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-emerald-700 active:scale-90 transition-transform disabled:opacity-50"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
