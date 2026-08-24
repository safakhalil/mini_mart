import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Clock,
  CreditCard,
  RotateCcw,
  Truck,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { FAQItem } from '../../types';

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'How fast is 24/7 Mart delivery and what are your operating hours?',
    answer:
      'We are open 24 hours a day, 7 days a week, 365 days a year. Our average delivery time is 25 to 35 minutes across all supported metro areas and neighborhoods. You can place an order at 2:00 PM or 3:00 AM and receive real-time courier tracking immediately.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'Is there a minimum order amount or delivery fee?',
    answer:
      'There is no strict minimum order requirement! Orders over $35 qualify for completely FREE fast delivery. For orders under $35, a flat convenience delivery fee of $2.99 applies to cover driver dispatch and thermal temperature-controlled packaging.',
  },
  {
    id: 'faq-3',
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major Credit & Debit cards (Visa, Mastercard, American Express, Discover), Digital Wallets (Apple Pay, Google Pay), and Cash on Delivery (COD). All online payment transactions are processed with 256-bit SSL bank-grade encryption.',
  },
  {
    id: 'faq-4',
    category: 'quality',
    question: 'How does temperature-controlled packing protect frozen & dairy items?',
    answer:
      'All perishable items (ice cream, frozen pizzas, cold beverages, fresh dairy, meats, and farm eggs) are packed in insulated multi-layer thermal cooler bags with reusable food-safe cold gel packs. We guarantee cold items arrive frosty and frozen items remain solid.',
  },
  {
    id: 'faq-5',
    category: 'returns',
    question: 'What is your return, refund, and freshness guarantee policy?',
    answer:
      'We provide a 100% Freshness & Satisfaction Guarantee. If any product arrives damaged, missing, or fails to meet your quality expectations, you can request an instant refund or replacement through the app within 24 hours of delivery. No questions asked.',
  },
  {
    id: 'faq-6',
    category: 'orders',
    question: 'Can I leave specific delivery instructions for the courier?',
    answer:
      'Yes! During checkout, you can select convenient one-tap presets (e.g. "Leave at Doorstep", "Ring Bell Twice", "Call Upon Arrival") or write custom gate codes and apartment access notes. Couriers follow these instructions carefully.',
  },
  {
    id: 'faq-7',
    category: 'orders',
    question: 'What if an item I want is out of stock?',
    answer:
      'You can tap the "Notify me when available" button on any out-of-stock product to register your email. As soon as our warehouse restocks the product, you will receive an automatic instant alert notification so you can order immediately.',
  },
];

interface FAQAccordionProps {
  initialOpenId?: string;
  categoryFilter?: string;
  showSearch?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  initialOpenId = 'faq-1',
  categoryFilter,
  showSearch = true,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([initialOpenId]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(categoryFilter || 'all');

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    if (selectedCat !== 'all' && faq.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'delivery', label: 'Delivery & Times', icon: Truck },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'quality', label: 'Freshness & Packing', icon: ShieldCheck },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'orders', label: 'Orders & Instructions', icon: Clock },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Category Pills & Search */}
      {showSearch && (
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search delivery, payments, returns FAQs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Accordion List */}
      <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No matching questions found for "{searchQuery}". Contact our 24/7 support hotline!
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div key={faq.id} className="transition-colors hover:bg-slate-800/30">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 select-none focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-100 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 bg-slate-900/40 animate-in fade-in duration-150">
                    <p className="pl-9">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
