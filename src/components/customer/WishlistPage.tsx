import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';

interface WishlistPageProps {
  onQuickView: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onNavigateShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onQuickView,
  onSelectProduct,
  onNavigateShop,
}) => {
  const { wishlist, products, addToCart, toggleWishlist, showToast } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlistedProducts.forEach((p) => {
      if (p.stock > 0) {
        addToCart(p, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(`Added ${addedCount} wishlist item(s) to your cart!`, 'success');
    } else {
      showToast('All wishlisted items are currently out of stock.', 'info');
    }
  };

  const handleClearWishlist = () => {
    wishlist.forEach((id) => toggleWishlist(id));
    showToast('Wishlist cleared', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-bold text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 px-3 py-1 rounded-full w-max mb-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Saved Favorites (Persisted)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] dark:text-white tracking-tight">
            My Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Items saved here remain saved across browser sessions and page reloads
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearWishlist}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#21262D] text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
              title="Clear all items from wishlist"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All In-Stock to Cart</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-slate-100 dark:border-[#21262D] p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto border border-rose-200/60 dark:border-rose-900/40">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tap the heart icon on any product in the shop to save it here for fast re-ordering.
            </p>
          </div>
          <button
            onClick={onNavigateShop}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore Groceries & Snacks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigateDetails={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
