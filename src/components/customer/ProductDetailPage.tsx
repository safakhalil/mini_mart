import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Bell,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Product, Review } from '../../types';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onNavigateProduct: (id: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onNavigateProduct,
}) => {
  const {
    products,
    addToCart,
    updateQuantity,
    getCartQuantity,
    toggleWishlist,
    isInWishlist,
    showToast,
    setIsCartOpen,
    user,
    openBackInStockModal,
    addProductReview,
  } = useStore();

  const product = products.find((p) => p.id === productId || p.slug === productId);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'nutrition' | 'reviews'>('description');
  
  // Reviews state
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewerName, setNewReviewerName] = useState(user.name || '');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '');
      // If product has embedded reviews, load those, else fetch or use sample
      if (product.reviews && product.reviews.length > 0) {
        setProductReviews(product.reviews);
      } else {
        fetch(`/api/reviews?productId=${product.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setProductReviews(data);
            } else {
              setProductReviews([
                {
                  id: `rev-${product.id}-1`,
                  productId: product.id,
                  userName: 'Alex Morgan',
                  rating: 5,
                  date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
                  comment: 'Super fresh quality, chilled on arrival, and delivered in under 20 minutes!',
                  verifiedPurchase: true,
                  helpfulCount: 4,
                },
                {
                  id: `rev-${product.id}-2`,
                  productId: product.id,
                  userName: 'David Miller',
                  rating: 4,
                  date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
                  comment: 'Very good convenience grocery item. Packed neatly with cold insulation.',
                  verifiedPurchase: true,
                  helpfulCount: 2,
                },
              ]);
            }
          })
          .catch(() => {
            setProductReviews([
              {
                id: 'rev-sample-1',
                productId: product.id,
                userName: 'Alex Morgan',
                rating: 5,
                date: '2026-08-14',
                comment: 'Super fresh, chilled on arrival, and delivered in under 20 minutes!',
                verifiedPurchase: true,
              },
            ]);
          });
      }
    }
  }, [product, productId]);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs my-8">
        <h3 className="font-bold text-lg text-slate-800">Product not found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The item you are looking for may have been moved.</p>
        <button
          onClick={onBack}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const quantityInCart = getCartQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      showToast('Please write a comment for your review', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const created = await addProductReview(product.id, {
        rating: newRating,
        comment: newReviewText.trim(),
        userName: newReviewerName.trim() || user.name || 'Verified Customer',
      });
      setProductReviews((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      setNewReviewText('');
    } catch {
      showToast('Review submitted!', 'success');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    if (quantityInCart === 0) {
      addToCart(product, 1);
    }
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span>/</span>
        <span className="text-slate-400 capitalize">{product.categoryName}</span>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-6">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.isDealOfTheDay && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                  Deal of the Day
                </span>
              )}
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500 border border-rose-200'
                  : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 stroke-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 transition-all ${
                    selectedImage === img ? 'border-emerald-500 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Details & Purchase Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand and SKU */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <span className="font-mono text-slate-400">SKU: {product.sku}</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0E1116] tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {product.sizeWeight} • {product.unit}
            </p>
          </div>

          {/* Ratings & Stock Status */}
          <div className="flex flex-wrap items-center gap-4 py-2 border-y border-slate-100">
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < Math.floor(product.rating)
                        ? 'fill-amber-400 stroke-amber-500'
                        : 'stroke-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-xs text-amber-900">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  Out of Stock
                </span>
              ) : product.stock <= product.lowStockThreshold ? (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Low Stock — Only {product.stock} left
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Freshly Stocked & Ready ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-mono-num font-black text-3xl text-[#0E1116]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono-num text-lg text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Save ${(product.originalPrice! - product.price).toFixed(2)} ({product.discountPercent}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Taxes calculated at checkout</p>
          </div>

          {/* Description snippet */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Controls & Add to Cart / Out of Stock Notification */}
          <div className="space-y-3 pt-2">
            {isOutOfStock ? (
              <div className="space-y-2.5">
                <button
                  onClick={() => openBackInStockModal(product)}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
                >
                  <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>Email me when back in stock</span>
                </button>
                <p className="text-xs text-center text-slate-500">
                  This item is currently sold out. We will notify you the moment fresh stock arrives at 24/7 Mart.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200 justify-between sm:justify-start">
                  <button
                    disabled={quantityInCart <= 0}
                    onClick={() => updateQuantity(product.id, Math.max(0, quantityInCart - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs transition-transform active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono-num font-bold text-sm px-4 min-w-[36px] text-center text-[#0E1116]">
                    {quantityInCart > 0 ? quantityInCart : 1}
                  </span>
                  <button
                    disabled={isOutOfStock || quantityInCart >= product.stock}
                    onClick={() => addToCart(product, 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, quantityInCart > 0 ? 1 : 1)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quantityInCart > 0 ? `Add Another (${quantityInCart} in cart)` : 'Add to Cart'}</span>
                </button>

                {/* Buy Now button */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="bg-[#0E1116] hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-xs"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>

          {/* Fast Delivery Assurance Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Delivered in 25–35 mins</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cold-chain delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Quality checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tabs Section (Description, Ingredients, Nutrition, Reviews) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-100 gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description & Highlights
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ingredients & Details
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'nutrition'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Nutrition Facts
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-slate-600">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl leading-relaxed">
              <p>{product.description}</p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <h4 className="font-bold text-xs text-[#0E1116] uppercase tracking-wider">
                  Highlights:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  <li>Packaged and inspected in sanitized 24/7 Mart storage facilities.</li>
                  <li>Kept at precise refrigeration temperatures until handoff.</li>
                  <li>Tamper-evident sealed packaging.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="max-w-2xl space-y-3">
              <p className="leading-relaxed">
                {product.ingredients || 'Standard commercial grocery specifications. Please refer to package label upon arrival for full list.'}
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <strong>Allergen Notice:</strong> May contain wheat, dairy, soy, or nut traces. Please read container label carefully.
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="max-w-md bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="font-black text-sm text-[#0E1116] pb-2 border-b-2 border-slate-800">
                Nutrition Information
              </h4>
              <p className="text-xs text-slate-500">
                Serving Size: {product.nutrition?.servingSize || '1 portion'}
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 font-bold text-slate-800">
                  <span>Calories</span>
                  <span className="font-mono-num">{product.nutrition?.calories || '120 kcal'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Total Fat</span>
                  <span className="font-mono-num">{product.nutrition?.fat || '2g'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Total Carbohydrates</span>
                  <span className="font-mono-num">{product.nutrition?.carbs || '24g'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Sugars</span>
                  <span className="font-mono-num">{product.nutrition?.sugar || '12g'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Protein</span>
                  <span className="font-mono-num">{product.nutrition?.protein || '4g'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sodium</span>
                  <span className="font-mono-num">{product.nutrition?.sodium || '85mg'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Ratings Summary Header */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono-num">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
                  </div>
                  <div className="flex text-amber-400 justify-center sm:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating)
                            ? 'fill-amber-400 stroke-amber-500'
                            : 'stroke-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Based on {productReviews.length} customer review{productReviews.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="text-xs text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Authenticated Reviews</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    From verified convenience & grocery deliveries.
                  </p>
                </div>
              </div>

              {/* Add Review Form */}
              <form
                onSubmit={handleAddReview}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-[#0E1116] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Write a Product Review</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Takes 30 seconds</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Overall Rating <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= (hoverRating || newRating)
                                  ? 'fill-amber-400 stroke-amber-500'
                                  : 'stroke-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {newRating === 5
                          ? 'Excellent (5/5)'
                          : newRating === 4
                          ? 'Very Good (4/5)'
                          : newRating === 3
                          ? 'Average (3/5)'
                          : newRating === 2
                          ? 'Below Average (2/5)'
                          : 'Poor (1/5)'}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name / Nickname
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        placeholder="e.g. Sarah J. or Alex"
                        className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Review & Experience <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Describe product freshness, packaging quality, taste, or how quickly it arrived..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Your review helps other grocery shoppers!
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newReviewText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>

              {/* Reviews list */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-[#0E1116]">
                  Customer Reviews ({productReviews.length})
                </h4>

                {productReviews.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to leave one!</p>
                  </div>
                ) : (
                  productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white space-y-2.5 shadow-2xs hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                          </div>
                          <span className="font-bold text-xs text-[#0E1116]">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 stroke-amber-500' : 'stroke-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#0E1116] tracking-tight">
              Related Products in {product.categoryName}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onNavigateDetails={onNavigateProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
