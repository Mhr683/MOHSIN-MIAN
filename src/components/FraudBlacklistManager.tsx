import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { BlacklistEntry } from '../types';

export const FraudBlacklistManager: React.FC = () => {
  const [entries, setEntries] = useState<BlacklistEntry[]>([
    {
      id: 'bl-1',
      phone: '0300-0000000',
      customerName: 'High Risk Buyer',
      reason: 'Repeated COD refusals at doorstep across Lahore & Faisalabad (5x RTO).',
      city: 'Lahore',
      reportedBy: 'Trax Courier API',
      reportedAt: '2026-03-01',
      addedAt: '2026-03-01',
      failedDeliveriesCount: 5,
      reportedCount: 5,
    },
    {
      id: 'bl-2',
      phone: '0311-1111111',
      customerName: 'Unreachable Buyer',
      reason: 'Fake order placement with uncontactable address.',
      city: 'Karachi',
      reportedBy: 'PostEx Rapid',
      reportedAt: '2026-03-15',
      addedAt: '2026-03-15',
      failedDeliveriesCount: 3,
      reportedCount: 3,
    },
  ]);

  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [reason, setReason] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setEntries((prev) => [
      {
        id: `bl-${Date.now()}`,
        phone,
        customerName: 'Flagged Buyer',
        city: city || 'Pakistan',
        reason: reason || 'Reported fraudulent RTO return pattern',
        reportedBy: 'Admin Portal',
        reportedAt: new Date().toISOString().split('T')[0],
        addedAt: new Date().toISOString().split('T')[0],
        failedDeliveriesCount: 1,
        reportedCount: 1,
      },
      ...prev,
    ]);
    setPhone('');
    setCity('');
    setReason('');
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 border border-red-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-500/20 p-3 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">National COD Fraud & RTO Blacklist Desk</h2>
            <p className="text-xs text-slate-300">
              Shared national blacklist blocking abusive buyers, chronic COD returners, and fake parcel orders.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleAdd} className="lg:col-span-5 rounded-3xl bg-slate-900 p-6 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-red-400" />
            <span>Add Phone Number to Blacklist</span>
          </h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Customer Mobile #</label>
            <input
              type="text"
              required
              placeholder="0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">City / Region</label>
            <input
              type="text"
              placeholder="e.g. Faisalabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reason / Infraction</label>
            <textarea
              rows={3}
              placeholder="Refused delivery, courier delivery boy reported abuse, fake address..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
          >
            Blacklist Mobile Number
          </button>
        </form>

        <div className="lg:col-span-7 rounded-3xl bg-slate-900 p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Active Blacklisted Records ({entries.length})</h3>

          <div className="space-y-3">
            {entries.map((ent) => (
              <div
                key={ent.id}
                className="flex items-start justify-between gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400 text-sm">{ent.phone}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                      {ent.reportedCount || 1}x Reported
                    </span>
                  </div>
                  <div className="text-slate-300">{ent.reason}</div>
                  <div className="text-[10px] text-slate-500">
                    City: {ent.city} • Added: {ent.addedAt}
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(ent.id)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-800 hover:text-red-400 transition"
                  title="Remove from blacklist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
