import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Circle,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useStore } from '../../context/StoreContext';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSwitchToCustomer: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
  { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Sales & Reports', icon: BarChart3 },
  { id: 'promotions', label: 'Discounts & Promo', icon: Tag },
  { id: 'settings', label: 'Store Settings', icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onSwitchToCustomer,
  children,
}) => {
  const { adminUser, adminLogout, orders, products } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => ['placed', 'confirmed', 'preparing'].includes(o.status)).length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-[#0E1116] border-r border-slate-800 flex-col justify-between p-4 shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="px-2 py-2">
            <Logo variant="light" size="md" />
            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400">Store Online 24/7</span>
              </div>
              <span className="text-slate-500 font-mono">v2.4</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const hasBadge = (item.id === 'orders' && pendingOrdersCount > 0) || (item.id === 'inventory' && lowStockCount > 0);
              const badgeCount = item.id === 'orders' ? pendingOrdersCount : lowStockCount;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {hasBadge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-emerald-800'
                          : item.id === 'orders'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: User & Switch Store */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={onSwitchToCustomer}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700/60"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Open Customer Store</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-2 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {adminUser?.name.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-200 truncate">{adminUser?.name || 'Store Admin'}</p>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={adminLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="lg:hidden bg-[#0E1116] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo variant="light" size="sm" />
        </div>

        <button
          onClick={onSwitchToCustomer}
          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0E1116] border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top duration-150 z-30">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">{adminUser?.name}</span>
            <button onClick={adminLogout} className="text-rose-400 font-bold">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header Bar inside workspace */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-[#0E1116]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-200 capitalize">
              Management Portal / <span className="text-emerald-400">{currentTab}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {pendingOrdersCount > 0 && (
              <button
                onClick={() => onTabChange('orders')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{pendingOrdersCount} New Orders Pending Delivery</span>
              </button>
            )}

            <button
              onClick={onSwitchToCustomer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
