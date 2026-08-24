import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Clock,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FAQAccordion } from './FAQAccordion';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { storeSettings } = useStore();
  const [showFaqSection, setShowFaqSection] = useState(true);

  return (
    <footer className="bg-[#0E1116] text-slate-300 border-t border-[#1F2530] mt-16">
      {/* Top Value Propositions */}
      <div className="border-b border-[#1F2530]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Always Open 24/7</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Day, night, or late hours — delivered in 25–35 mins.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Fast Free Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  On all qualifying orders over ${storeSettings.freeDeliveryThreshold.toFixed(0)}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">100% Fresh Guarantee</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cold-chain packing and temperature-controlled bags.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant refund if any item doesn't meet your expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion FAQs Section */}
      <div id="footer-faqs" className="border-b border-[#1F2530] bg-[#0A0D12]/60 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400">Everything you need to know about 24/7 delivery, payments, and quality</p>
              </div>
            </div>
            <button
              onClick={() => setShowFaqSection(!showFaqSection)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40"
            >
              <span>{showFaqSection ? 'Collapse' : 'Expand All'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFaqSection ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFaqSection && <FAQAccordion />}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your trusted 24-hour online convenience and grocery mart. Delivering snacks, cold drinks, farm-fresh produce, dairy, frozen foods, and daily essentials straight to your door in minutes.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeSettings.supportPhone} (24/7 Hotline)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeSettings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Serving Metro Hubs, Suburbs & Financial Districts</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'snacks')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Snacks & Crisps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'beverages')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Beverages & Sodas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'fresh-food')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fresh Food & Fruits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'dairy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Dairy & Farm Eggs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'frozen-food')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Frozen Pizzas & Ice Cream
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  View All 12 Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Customer Help
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Active Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Past Order History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Addresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Delivery Coverage Area
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  24/7 Live Support Chat
                </span>
              </li>
            </ul>
          </div>

          {/* Management / Admin Portal */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Store Portal
            </h5>
            <p className="text-xs text-slate-400 mb-3">
              Authorized staff and store administrators can access inventory, live orders, sales analytics and settings.
            </p>
            <button
              onClick={() => onNavigate('admin')}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Sign In to Admin Portal
            </button>
            <div className="mt-4 pt-3 border-t border-[#1F2530] text-[11px] text-slate-500">
              <span>Demo Login: admin@247mart.com / admin123</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1F2530] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 24/7 Mart Inc. All rights reserved. Your Everyday Essentials. Anytime.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
