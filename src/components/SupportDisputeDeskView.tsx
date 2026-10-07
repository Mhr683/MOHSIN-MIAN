import React, { useState } from 'react';
import { HelpCircle, AlertCircle, CheckCircle, MessageSquare, ShieldAlert } from 'lucide-react';
import { Order, User } from '../types';

interface SupportDisputeDeskViewProps {
  currentUser: User;
  orders: Order[];
  onRefundDispute?: (resellerId: string, amount: number, reason: string) => void;
  onLogAudit?: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

export const SupportDisputeDeskView: React.FC<SupportDisputeDeskViewProps> = ({
  currentUser,
  orders,
  onRefundDispute,
  onLogAudit,
}) => {
  const [tickets, setTickets] = useState([
    {
      id: 'TICK-801',
      orderNumber: 'YM-8821',
      title: 'Customer Received Damaged Packaging Flyer',
      customerName: 'Muhammad Bilal',
      status: 'UNDER_INVESTIGATION',
      claimAmountPKR: 850,
      openedAt: '2026-03-05',
    },
    {
      id: 'TICK-802',
      orderNumber: 'YM-8822',
      title: 'Courier Delayed Delivery Past 5 Business Days',
      customerName: 'Ali Raza',
      status: 'RESOLVED',
      claimAmountPKR: 200,
      openedAt: '2026-03-02',
    },
  ]);

  const handleResolve = (id: string, amount: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t))
    );
    if (onRefundDispute) {
      onRefundDispute(currentUser.id, amount, `Dispute resolution claim for ${id}`);
    }
    if (onLogAudit) {
      onLogAudit('DISPUTE_REFUNDED', `Refunded Rs. ${amount} for ticket ${id}`, 'SUCCESS');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 border border-red-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-500/20 p-3 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Dispute & Customer Claim Arbitration Desk</h2>
            <p className="text-xs text-slate-300">
              Resolve courier transit damages, missing parcels, and customer returns with 100% factory escrow protection.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.map((tk) => (
          <div
            key={tk.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 border border-slate-800 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold">{tk.id}</span>
                <span className="font-bold text-white text-sm">{tk.title}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    tk.status === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {tk.status}
                </span>
              </div>
              <div className="text-slate-400">
                Order: #{tk.orderNumber} • Consignee: {tk.customerName} • Claim: Rs. {tk.claimAmountPKR.toLocaleString()}
              </div>
            </div>

            {tk.status !== 'RESOLVED' && (
              <button
                onClick={() => handleResolve(tk.id, tk.claimAmountPKR)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer self-start sm:self-auto"
              >
                Approve Supplier Escrow Refund
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
