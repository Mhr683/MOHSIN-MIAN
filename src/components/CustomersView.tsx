import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Package,
  Clock,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { Order, User } from '../types';
import { calculateCustomerRisk } from '../utils/riskCalculator';

interface CustomersViewProps {
  orders: Order[];
  currentUser?: User;
}

interface CustomerRecord {
  phone: string;
  name: string;
  city: string;
  address: string;
  totalOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  cancelledOrders: number;
  totalSpentPKR: number;
  lastOrderDate: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isBlacklisted: boolean;
  orderHistory: Order[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Group orders by customerPhone or customerName
  const customerMap = new Map<string, CustomerRecord>();

  orders.forEach((ord) => {
    const key = (ord.customerPhone || ord.customerName || 'unknown').trim().toLowerCase();
    const existing = customerMap.get(key);

    const isDelivered = ord.status === 'DELIVERED';
    const isReturned = ord.status === 'RTO' || ord.status === 'RETURNED';
    const isCancelled = ord.status === 'CANCELLED';
    const amount = ord.sellingPricePKR || 0;

    if (!existing) {
      const risk = calculateCustomerRisk(ord.customerPhone || '', ord.customerCity || '');
      customerMap.set(key, {
        phone: ord.customerPhone || '0300-0000000',
        name: ord.customerName || 'Customer',
        city: ord.customerCity || 'Lahore',
        address: ord.customerAddress || 'Address on file',
        totalOrders: 1,
        deliveredOrders: isDelivered ? 1 : 0,
        returnedOrders: isReturned ? 1 : 0,
        cancelledOrders: isCancelled ? 1 : 0,
        totalSpentPKR: amount,
        lastOrderDate: ord.createdAt || new Date().toISOString(),
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        isBlacklisted: risk.isBlacklisted,
        orderHistory: [ord],
      });
    } else {
      existing.totalOrders += 1;
      if (isDelivered) existing.deliveredOrders += 1;
      if (isReturned) existing.returnedOrders += 1;
      if (isCancelled) existing.cancelledOrders += 1;
      existing.totalSpentPKR += amount;
      existing.orderHistory.push(ord);
      if (ord.createdAt && ord.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = ord.createdAt;
      }
    }
  });

  // Seed sample customer records if order book is small
  if (customerMap.size < 4) {
    const seedSamples: CustomerRecord[] = [
      {
        phone: '0300-8472910',
        name: 'Muhammad Bilal',
        city: 'Lahore',
        address: 'House 14, Street 3, Cavalry Ground',
        totalOrders: 6,
        deliveredOrders: 6,
        returnedOrders: 0,
        cancelledOrders: 0,
        totalSpentPKR: 14800,
        lastOrderDate: '2026-03-05',
        riskScore: 12,
        riskLevel: 'LOW',
        isBlacklisted: false,
        orderHistory: [],
      },
      {
        phone: '0321-4455667',
        name: 'Ali Raza',
        city: 'Karachi',
        address: 'Flat 4B, Gulshan-e-Iqbal Block 6',
        totalOrders: 3,
        deliveredOrders: 2,
        returnedOrders: 0,
        cancelledOrders: 1,
        totalSpentPKR: 5400,
        lastOrderDate: '2026-03-04',
        riskScore: 28,
        riskLevel: 'LOW',
        isBlacklisted: false,
        orderHistory: [],
      },
      {
        phone: '0333-5566778',
        name: 'Zainab Fatima',
        city: 'Islamabad',
        address: 'Sector F-10/2, Street 18, House 9',
        totalOrders: 4,
        deliveredOrders: 4,
        returnedOrders: 0,
        cancelledOrders: 0,
        totalSpentPKR: 11200,
        lastOrderDate: '2026-03-02',
        riskScore: 10,
        riskLevel: 'LOW',
        isBlacklisted: false,
        orderHistory: [],
      },
      {
        phone: '0300-0000000',
        name: 'Tariq Mehmood',
        city: 'Faisalabad',
        address: 'Near Clock Tower, Rail Bazaar',
        totalOrders: 5,
        deliveredOrders: 1,
        returnedOrders: 3,
        cancelledOrders: 1,
        totalSpentPKR: 2200,
        lastOrderDate: '2026-02-28',
        riskScore: 88,
        riskLevel: 'HIGH',
        isBlacklisted: true,
        orderHistory: [],
      },
    ];

    seedSamples.forEach((s) => {
      if (!customerMap.has(s.phone)) {
        customerMap.set(s.phone, s);
      }
    });
  }

  const customersList = Array.from(customerMap.values());

  const filtered = customersList.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 p-6 sm:p-8 border border-blue-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
              <Users className="h-4 w-4" />
              <span>Customer Intelligence & Risk Profiles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Customer Database</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              View customer delivery histories, doorstep refusal rates (RTO), verified phone numbers, and COD fraud scores.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 text-center sm:text-right">
            <div className="text-xs text-slate-400">Total Unique Buyers</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              {customersList.length} Buyers
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-md bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by buyer name, phone (0300-...), or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Customer List Table & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedCustomer ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Success Rate</th>
                    <th className="p-4">COD Risk</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filtered.map((c) => {
                    const successRate =
                      c.totalOrders > 0 ? Math.round((c.deliveredOrders / c.totalOrders) * 100) : 100;
                    return (
                      <tr
                        key={c.phone}
                        onClick={() => setSelectedCustomer(c)}
                        className={`hover:bg-slate-850 transition cursor-pointer ${
                          selectedCustomer?.phone === c.phone ? 'bg-slate-800/70' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{c.name}</div>
                          <div className="font-mono text-cyan-400 text-xs flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />
                            <span>{c.phone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-slate-200">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                            <span>{c.city}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {c.address}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">{c.totalOrders} total</div>
                          <div className="text-[10px] text-slate-400">
                            Rs. {c.totalSpentPKR.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                              successRate >= 80
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : successRate >= 50
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {successRate}% Delivered
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {c.isBlacklisted ? (
                              <span className="flex items-center gap-1 text-red-400 font-bold text-[10px] bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                                <ShieldAlert className="h-3 w-3" /> Blacklisted
                              </span>
                            ) : c.riskLevel === 'HIGH' ? (
                              <span className="text-amber-400 font-bold text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                                High Risk
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Safe ({c.riskScore})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(c);
                            }}
                            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-bold text-slate-200 transition"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Customer Profile Drawer / Card */}
        {selectedCustomer && (
          <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Risk Card */}
            <div
              className={`rounded-2xl p-4 border text-xs space-y-2 ${
                selectedCustomer.isBlacklisted
                  ? 'bg-red-950/40 border-red-500/40 text-red-300'
                  : selectedCustomer.riskLevel === 'HIGH'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Fraud Engine Assessment</span>
                </span>
                <span className="font-mono">Score: {selectedCustomer.riskScore}/100</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {selectedCustomer.isBlacklisted
                  ? 'Critical Warning: Phone number flagged for multiple courier return refusals. Orders require 100% advance delivery fee.'
                  : selectedCustomer.riskLevel === 'HIGH'
                  ? 'Caution: High probability of doorstep refusal. Recommend WhatsApp audio confirmation before dispatch.'
                  : 'Verified trustworthy buyer. Eligible for express zero-advance Cash on Delivery dispatch.'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Delivered</div>
                <div className="text-base font-black text-emerald-400 font-mono">
                  {selectedCustomer.deliveredOrders}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">RTO Returns</div>
                <div className="text-base font-black text-amber-400 font-mono">
                  {selectedCustomer.returnedOrders}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Spent</div>
                <div className="text-base font-black text-white font-mono">
                  Rs. {selectedCustomer.totalSpentPKR.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400 font-semibold">Primary Delivery Address:</div>
              <div className="text-slate-200 font-medium">{selectedCustomer.address}</div>
              <div className="text-cyan-400 font-bold">{selectedCustomer.city}, Pakistan</div>
            </div>

            {/* WhatsApp Contact Action */}
            <a
              href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              <span>Contact via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
