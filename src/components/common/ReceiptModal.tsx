import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Scissors,
  Check,
  Copy,
  Clock,
  MapPin,
  FileText,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, receiptOrder, storeSettings, showToast } =
    useStore();
  const [isTorn, setIsTorn] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isReceiptModalOpen) {
      setIsTorn(false);
      setIsTearing(false);
      setCopied(false);
    }
  }, [isReceiptModalOpen, receiptOrder]);

  if (!isReceiptModalOpen || !receiptOrder) return null;

  const order = receiptOrder;
  const subtotal = order.subtotal || order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = order.discount || 0;
  const tax = order.tax || Number(((subtotal - discount) * (storeSettings.taxRatePercent / 100)).toFixed(2));
  const deliveryFee = order.deliveryFee ?? (subtotal >= storeSettings.freeDeliveryThreshold ? 0 : storeSettings.deliveryFee);
  const total = order.total || Number((subtotal - discount + tax + deliveryFee).toFixed(2));

  const handlePrint = () => {
    window.print();
  };

  const handleTearAndPrint = () => {
    if (isTearing || isTorn) {
      handlePrint();
      return;
    }
    setIsTearing(true);
    // Play light synthetic tear click or visual transition
    setTimeout(() => {
      setIsTearing(false);
      setIsTorn(true);
      showToast('Receipt torn cleanly! Opening print dialog...', 'success');
      setTimeout(() => {
        handlePrint();
      }, 350);
    }, 550);
  };

  const handleCopyTextReceipt = () => {
    const textReceipt = `
========================================
         24/7 MART EXPRESS STORE
     Convenience & Grocery Non-Stop
========================================
Receipt #: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer: ${order.customerName || order.deliveryAddress.fullName}
Phone: ${order.customerPhone || order.deliveryAddress.phone}
Address: ${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}
${order.deliveryAddress.deliveryInstructions ? `Delivery Notes: ${order.deliveryAddress.deliveryInstructions}\n` : ''}Payment: ${order.paymentMethod.toUpperCase().replace('_', ' ')} (${order.paymentStatus.toUpperCase()})
----------------------------------------
ITEMS:
${order.items.map((i) => `${i.quantity}x ${i.productName || (i as any).name} @ $${i.price.toFixed(2)} = $${(i.price * i.quantity).toFixed(2)}`).join('\n')}
----------------------------------------
Subtotal:       $${subtotal.toFixed(2)}
${discount > 0 ? `Promo Discount: -$${discount.toFixed(2)} (${order.promoCode || 'PROMO'})\n` : ''}Delivery Fee:   ${deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
Est. Tax:       $${tax.toFixed(2)}
----------------------------------------
GRAND TOTAL:    $${total.toFixed(2)}
========================================
  Thank you for shopping with 24/7 Mart!
  Need help? support@247mart.com
========================================
    `.trim();

    navigator.clipboard.writeText(textReceipt).then(() => {
      setCopied(true);
      showToast('Plain text receipt copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md my-6 flex flex-col items-center">
        {/* Top Control Bar (Non-Printable) */}
        <div className="w-full flex items-center justify-between bg-slate-900/90 text-white px-4 py-2.5 rounded-t-2xl border-t border-x border-slate-700 backdrop-blur-md no-print z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Printer className="w-4 h-4" />
            <span>Thermal Cashier Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTextReceipt}
              title="Copy text summary"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printer Chassis Header Simulation */}
        <div className="w-full bg-[#161B22] border-x border-slate-800 px-6 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              24/7 THERMAL-PRINT POS #04
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">READY</span>
        </div>

        {/* Printer Slot Ejection Slit */}
        <div className="w-full h-3 bg-slate-950 border-x border-slate-800 relative shadow-inner no-print flex items-center justify-center">
          <div className="w-11/12 h-1 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Paper Receipt Container */}
        <div
          id="printable-receipt"
          className={`w-full bg-white text-slate-900 font-mono shadow-2xl transition-all duration-500 receipt-jagged-edge ${
            isTearing ? 'animate-receipt-tear scale-[0.98]' : isTorn ? 'translate-y-4 rotate-[-0.5deg]' : 'animate-receipt-feed'
          }`}
          style={{
            fontFamily: "'Courier Prime', 'SF Mono', 'Roboto Mono', 'Courier New', monospace",
          }}
        >
          {/* Receipt Content Body */}
          <div className="p-6 sm:p-7 space-y-4 text-xs leading-tight">
            {/* Header / Logo */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-slate-300">
              <div className="inline-block bg-slate-900 text-white font-black text-sm px-2.5 py-1 tracking-widest uppercase mb-1">
                24/7 MART
              </div>
              <h2 className="font-bold text-sm tracking-tight text-slate-950">
                EXPRESS GROCERY & CONVENIENCE
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Store #104 • 24/7 Fast Delivery Hub
              </p>
              <p className="text-[10px] text-slate-500">
                Support: {storeSettings.supportPhone} • Tax ID: US-8829-247
              </p>
            </div>

            {/* Order Metadata */}
            <div className="space-y-1 text-[11px] text-slate-700 pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="font-bold">ORDER NO:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE/TIME:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span>CUSTOMER:</span>
                <span className="truncate max-w-[180px] text-right font-medium">
                  {order.customerName || order.deliveryAddress.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT:</span>
                <span className="font-bold uppercase text-emerald-700">
                  {order.paymentMethod.replace('_', ' ')} ({order.paymentStatus})
                </span>
              </div>
              <div className="flex justify-between">
                <span>DISPATCH:</span>
                <span>Electric Courier (25-35m)</span>
              </div>
            </div>

            {/* Delivery Destination & Specific Instructions */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] space-y-1">
              <div className="flex items-start gap-1 font-bold text-slate-900">
                <MapPin className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                <span>DELIVERY DESTINATION:</span>
              </div>
              <p className="text-slate-700 pl-4">
                {order.deliveryAddress.streetAddress}
                {order.deliveryAddress.aptSuite ? `, ${order.deliveryAddress.aptSuite}` : ''}, {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
              </p>
              {order.deliveryAddress.deliveryInstructions && (
                <div className="mt-1 pt-1 border-t border-slate-200 text-slate-900 pl-4 font-semibold">
                  <span className="text-emerald-700">DRIVER NOTES: </span>
                  "{order.deliveryAddress.deliveryInstructions}"
                </div>
              )}
            </div>

            {/* Items Table Header */}
            <div className="pt-1">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 pb-1 border-b border-slate-300 uppercase">
                <span className="col-span-2">QTY</span>
                <span className="col-span-6">DESCRIPTION</span>
                <span className="col-span-2 text-right">PRICE</span>
                <span className="col-span-2 text-right">TOTAL</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 py-1">
                {order.items.map((item, idx) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={idx} className="grid grid-cols-12 text-[11px] py-1.5 items-center">
                      <span className="col-span-2 font-bold">{item.quantity}x</span>
                      <span className="col-span-6 font-medium text-slate-900 truncate pr-1">
                        {item.productName || (item as any).name}
                      </span>
                      <span className="col-span-2 text-right text-slate-500 font-mono-num">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="col-span-2 text-right font-bold font-mono-num text-slate-950">
                        ${lineTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Calculations */}
            <div className="pt-2 border-t-2 border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">ITEMS SUBTOTAL:</span>
                <span className="font-mono-num font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>DISCOUNT ({order.promoCode || 'PROMO'}):</span>
                  <span className="font-mono-num">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-600">ESTIMATED TAX ({storeSettings.taxRatePercent}%):</span>
                <span className="font-mono-num font-semibold">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">EXPRESS DELIVERY:</span>
                <span className="font-mono-num font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-slate-900 text-sm font-black text-slate-950">
                <span>TOTAL PAID:</span>
                <span className="text-base font-mono-num">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Barcode & Footer Greeting */}
            <div className="text-center pt-3 pb-2 space-y-2 border-t border-dashed border-slate-300">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                *** REORDER ANYTIME AT 24/7 MART ***
              </p>

              {/* Simulated Thermal Barcode */}
              <div className="flex flex-col items-center justify-center pt-1">
                <div className="flex items-center gap-[2px] h-10 overflow-hidden px-4 py-1 bg-white">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3].map(
                    (w, i) => (
                      <div
                        key={i}
                        className="bg-black h-full"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    )
                  )}
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-500 mt-0.5">
                  *{order.orderNumber.replace(/[^A-Z0-9]/gi, '')}*
                </span>
              </div>

              <p className="text-[9px] text-slate-400">
                Non-stop 24/7 delivery. Keep receipt for returns & support inquiries.
              </p>
            </div>
          </div>

          {/* Interactive Perforated Tear-Off Strip (Non-Printable) */}
          <div className="no-print border-t-2 border-dashed border-slate-400/80 bg-slate-100/70 p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-700">
              <Scissors className="w-3.5 h-3.5 text-slate-500" />
              <span>{isTorn ? 'Receipt Separated' : 'Perforation Line'}</span>
            </div>

            {!isTorn ? (
              <button
                onClick={handleTearAndPrint}
                disabled={isTearing}
                className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Scissors className="w-3.5 h-3.5 rotate-90" />
                <span>{isTearing ? 'Tearing...' : 'Tear & Print'}</span>
              </button>
            ) : (
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Torn & Ready</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action Footer (Non-Printable) */}
        <div className="w-full bg-slate-900/90 border-b border-x border-slate-700 p-4 rounded-b-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 no-print mt-2 z-20">
          <div className="text-xs text-slate-400">
            <span>Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+P</kbd> to print anytime</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Clean Receipt</span>
            </button>

            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
