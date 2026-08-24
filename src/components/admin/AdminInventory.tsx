import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, restockProduct, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState(25);

  const lowStockItems = products.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0);
  const outOfStockItems = products.filter((p) => p.stock <= 0);

  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalStockValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);

  const filtered = products.filter((p) => {
    if (filterMode === 'low' && (p.stock > p.lowStockThreshold || p.stock === 0)) return false;
    if (filterMode === 'out' && p.stock > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    await restockProduct(selectedProduct.id, restockAmount);
    setSelectedProduct(null);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Name', 'Brand', 'Category', 'SKU', 'Stock', 'Threshold', 'Price', 'Valuation'].join(','),
      ...products.map((p) =>
        [
          p.id,
          `"${p.name}"`,
          `"${p.brand}"`,
          `"${p.categoryName}"`,
          p.sku,
          p.stock,
          p.lowStockThreshold,
          p.price,
          (p.stock * p.price).toFixed(2),
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `247mart-inventory-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Inventory report exported as CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Inventory & Stock Levels</h1>
          <p className="text-xs text-slate-400">
            Real-time shelf counts, automatic supplier thresholds and instant replenishment.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Stock CSV</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Total Inventory Units
          </span>
          <span className="font-mono-num text-2xl font-black text-white mt-1 block">
            {totalStockUnits.toLocaleString()} units
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Across all 12 store categories</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Total Stock Asset Value
          </span>
          <span className="font-mono-num text-2xl font-black text-emerald-400 mt-1 block">
            ${totalStockValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Current retail valuation</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Needs Restock Alert
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono-num text-2xl font-black text-amber-400">
              {lowStockItems.length} Low
            </span>
            <span className="text-xs font-bold text-rose-400">
              ({outOfStockItems.length} Out of Stock)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Below safety thresholds</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stock items..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterMode === 'low' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterMode === 'out' ? 'bg-rose-500 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Out of Stock ({outOfStockItems.length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Safety Limit</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Valuation</th>
                <th className="p-4 text-right">Replenish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = p.stock <= p.lowStockThreshold && !isOut;

                return (
                  <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg bg-white object-contain p-1 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white text-xs">{p.name}</h4>
                          <span className="text-[11px] text-slate-400">
                            {p.brand} • {p.categoryName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">{p.sku}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                          isOut
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>

                    <td className="p-4 font-mono text-slate-400 text-xs">
                      Min {p.lowStockThreshold} units
                    </td>

                    <td className="p-4 font-mono-num font-semibold text-white">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="p-4 font-mono-num font-bold text-slate-200">
                      ${(p.stock * p.price).toFixed(2)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => restockProduct(p.id, 10)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 rounded-lg transition-colors"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => restockProduct(p.id, 50)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-400 rounded-lg transition-colors"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white rounded-lg transition-colors"
                        >
                          Custom
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-bold text-base text-white">
              Replenish Stock: {selectedProduct.name}
            </h3>
            <p className="text-xs text-slate-400">
              Current inventory: <strong>{selectedProduct.stock} units</strong>
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Add Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Restock (+{restockAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
