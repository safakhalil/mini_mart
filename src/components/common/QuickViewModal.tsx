import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Check,
  Sparkles,
  Bell,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onNavigateDetails,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, openBackInStockModal } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleOpenBackInStock = () => {
    onClose();
    openBackInStockModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Left: Product Image */}
          <div className="space-y-3">
            <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden">
              {product.isDealOfTheDay && (
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>Deal</span>
                </span>
              )}
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-12 rounded-xl border p-1 bg-slate-50 transition-all ${
                      activeImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                {product.brand} • {product.categoryName}
              </span>
              <h3 className="text-xl font-black text-[#0E1116] leading-snug mt-0.5">
                {product.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{product.sizeWeight}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono-num text-2xl font-black text-[#0E1116]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono-num text-sm text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Add Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-600 hover:text-black rounded-lg hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-xs px-3 text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1.5 text-slate-600 hover:text-black rounded-lg hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isOutOfStock ? (
                  <button
                    onClick={handleOpenBackInStock}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 active:scale-[0.99] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span>Email Me When Back in Stock</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateDetails(product.id);
                }}
                className="w-full text-center text-xs font-bold text-emerald-700 hover:underline py-1"
              >
                View Full Product Specs & Nutrition Info →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
