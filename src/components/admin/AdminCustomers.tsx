import React, { useState } from 'react';
import { Users, Search, Mail, Phone, MapPin, Eye, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { customers } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-400">
            Registered 24/7 Mart grocery accounts, order frequency and loyalty spend.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
          {customers.length} Registered Accounts
        </span>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Member Since</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{cust.name}</h4>
                        <span className="text-[11px] text-slate-400">ID: {cust.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="text-slate-300">{cust.email}</p>
                    <p className="text-[11px] text-slate-500">{cust.phone}</p>
                  </td>

                  <td className="p-4 font-mono-num font-bold text-white">
                    {cust.ordersCount ?? cust.totalOrders ?? 0} orders
                  </td>

                  <td className="p-4 font-mono-num font-bold text-emerald-400">
                    ${(cust.totalSpent ?? 0).toFixed(2)}
                  </td>

                  <td className="p-4 text-slate-400">
                    {cust.joinedDate
                      ? new Date(cust.joinedDate).toLocaleDateString()
                      : cust.createdAt
                      ? new Date(cust.createdAt).toLocaleDateString()
                      : 'Recent'}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{cust.status.toUpperCase()}</span>
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedCustomer.name}</h3>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Active 24/7 Mart Customer
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {(() => {
                const primaryAddress =
                  selectedCustomer.address ||
                  (selectedCustomer.savedAddresses && selectedCustomer.savedAddresses.length > 0
                    ? selectedCustomer.savedAddresses[0]
                    : null);

                return (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {primaryAddress
                          ? `${primaryAddress.streetAddress}, ${primaryAddress.city} ${primaryAddress.postalCode}`
                          : 'No delivery address on file'}
                      </span>
                    </div>
                    {primaryAddress?.deliveryInstructions && (
                      <p className="text-[11px] bg-slate-900 p-2 rounded-lg text-slate-400 mt-1 border border-slate-800">
                        Instructions: {primaryAddress.deliveryInstructions}
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total Lifetime Orders
                  </span>
                  <span className="font-mono-num font-black text-xl text-white mt-1 block">
                    {selectedCustomer.ordersCount ?? selectedCustomer.totalOrders ?? 0}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Lifetime Grocery Spend
                  </span>
                  <span className="font-mono-num font-black text-xl text-emerald-400 mt-1 block">
                    ${(selectedCustomer.totalSpent ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
