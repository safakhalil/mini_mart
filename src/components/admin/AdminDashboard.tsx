import React from 'react';
import { Shield, BarChart3, Package, Users, Settings, LogOut, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">24/7 Mart Admin</h1>
              <p className="text-xs text-slate-400">Protected Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-slate-400">Manage your store, products, orders, and settings.</p>
        </div>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Analytics Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Analytics</h3>
            <p className="text-sm text-slate-400">View sales data and performance metrics</p>
          </div>

          {/* Products Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Products</h3>
            <p className="text-sm text-slate-400">Manage inventory and product listings</p>
          </div>

          {/* Orders Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Orders</h3>
            <p className="text-sm text-slate-400">Track and manage customer orders</p>
          </div>

          {/* Customers Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Customers</h3>
            <p className="text-sm text-slate-400">View customer data and history</p>
          </div>

          {/* Settings Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-slate-600/20 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Settings</h3>
            <p className="text-sm text-slate-400">Configure store settings and preferences</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-emerald-900/20 border border-emerald-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-400 mb-2">Security Information</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                This admin portal is protected by secret key authentication. Access is logged and monitored.
                Make sure to keep your secret key secure and never share it with unauthorized personnel.
                You can access this portal by adding <code className="bg-slate-800 px-2 py-1 rounded">?admin=true</code> 
                to the URL or by using the secret key parameter <code className="bg-slate-800 px-2 py-1 rounded">?secret=YOUR_KEY</code>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};