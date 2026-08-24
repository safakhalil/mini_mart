import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Zap,
  SlidersHorizontal,
  DollarSign,
  Boxes,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryId } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryId: 'snacks' as CategoryId,
    categoryName: 'Snacks & Crisps',
    price: 3.99,
    originalPrice: 4.49,
    discountPercent: 10,
    stock: 50,
    lowStockThreshold: 10,
    unit: '1 pack',
    sizeWeight: '150g',
    sku: 'MART-SKU-999',
    barcode: '890123456789',
    description: '',
    images: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    tags: 'snacks, popular',
    isFeatured: true,
    isDealOfTheDay: false,
  });

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      categoryId: 'snacks',
      categoryName: 'Snacks & Crisps',
      price: 3.99,
      originalPrice: 4.49,
      discountPercent: 10,
      stock: 50,
      lowStockThreshold: 10,
      unit: '1 pack',
      sizeWeight: '150g',
      sku: `MART-SKU-${Math.floor(100 + Math.random() * 900)}`,
      barcode: '890123456789',
      description: '',
      images: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
      tags: 'fresh, popular',
      isFeatured: false,
      isDealOfTheDay: false,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      discountPercent: p.discountPercent || 0,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      unit: p.unit,
      sizeWeight: p.sizeWeight,
      sku: p.sku,
      barcode: p.barcode,
      description: p.description,
      images: p.images.join(','),
      tags: p.tags.join(', '),
      isFeatured: p.isFeatured || false,
      isDealOfTheDay: p.isDealOfTheDay || false,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.id === formData.categoryId);

    const productPayload = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: formData.brand,
      categoryId: formData.categoryId,
      categoryName: catObj ? catObj.name : formData.categoryName,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      discountPercent: formData.discountPercent ? Number(formData.discountPercent) : 0,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      unit: formData.unit,
      sizeWeight: formData.sizeWeight,
      sku: formData.sku,
      barcode: formData.barcode,
      description: formData.description,
      images: formData.images.split(',').map((s) => s.trim()),
      tags: formData.tags.split(',').map((s) => s.trim()),
      isFeatured: formData.isFeatured,
      isDealOfTheDay: formData.isDealOfTheDay,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
      showToast(`Updated product: ${formData.name}`, 'success');
    } else {
      await addProduct(productPayload);
      showToast(`Created new product: ${formData.name}`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from store catalog?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400">
            Manage convenience store inventory, descriptions, pricing and deal promotions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="all">All Departments ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Promotions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg bg-white object-contain p-1 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          {p.brand}
                        </span>
                        <h4 className="font-bold text-white text-xs">{p.name}</h4>
                        <span className="text-[11px] text-slate-400">{p.sizeWeight}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 font-medium">{p.categoryName}</td>

                  <td className="p-4 font-mono text-[11px] text-slate-400">{p.sku}</td>

                  <td className="p-4 font-mono-num">
                    <span className="font-bold text-white text-xs">${p.price.toFixed(2)}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-slate-500 line-through text-[11px] block">
                        ${p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        p.stock <= 0
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : p.stock <= p.lowStockThreshold
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {p.isFeatured && (
                        <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Featured
                        </span>
                      )}
                      {p.isDealOfTheDay && (
                        <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Deal ⚡
                        </span>
                      )}
                      {!p.isFeatured && !p.isDealOfTheDay && (
                        <span className="text-slate-600 text-[11px]">Regular</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? 'Edit Store Product' : 'Add New Convenience Product'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value as CategoryId })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Low Stock Limit</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit / Size</label>
                  <input
                    type="text"
                    value={formData.sizeWeight}
                    onChange={(e) => setFormData({ ...formData, sizeWeight: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Image URL(s) comma-separated</label>
                <input
                  type="text"
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-hidden focus:border-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDealOfTheDay}
                    onChange={(e) =>
                      setFormData({ ...formData, isDealOfTheDay: e.target.checked })
                    }
                    className="rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Deal of the Day ⚡</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingProduct ? 'Save Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
