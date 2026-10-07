import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, DollarSign, Send, CheckCircle } from 'lucide-react';
import { User, WalletTransaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  transactions: WalletTransaction[];
  onAddFunds?: (amount: number) => void;
  onWithdrawFunds?: (amount: number, method: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onAddFunds,
  onWithdrawFunds,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('JAZZCASH');
  const [accountNumber, setAccountNumber] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || amt > (currentUser.walletBalancePKR || 0)) {
      setMsg('Invalid withdrawal amount');
      return;
    }
    if (onWithdrawFunds) {
      onWithdrawFunds(amt, `${withdrawMethod}: ${accountNumber}`);
    }
    setMsg(`Payout request of Rs. ${amt.toLocaleString()} submitted successfully!`);
    setWithdrawAmount('');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">YourMart Reseller Wallet</h3>
              <p className="text-xs text-slate-400">COD Profit margins & automated settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 p-6 border border-emerald-500/30 text-center space-y-1">
          <div className="text-xs font-semibold text-emerald-300">Available Payout Balance</div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
            Rs. {(currentUser.walletBalancePKR || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Settled from delivered courier consignments
          </div>
        </div>

        {msg && (
          <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{msg}</span>
          </div>
        )}

        {/* Payout Form */}
        <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
          <div className="font-bold text-slate-200">Request Instant Payout</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Amount (PKR)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Payout Gateway</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
              >
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">EasyPaisa</option>
                <option value="RAAST">Raast Instant ID</option>
                <option value="BANK_TRANSFER">Bank IBFT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Account Number / Phone</label>
            <input
              type="text"
              placeholder="03001234567 or IBAN"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            Submit Payout Request
          </button>
        </form>

        {/* Recent Transactions List */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-300">Transaction History</div>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-lg p-1.5 ${
                      tx.type === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{tx.description}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-mono font-bold ${
                    tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'CREDIT' ? '+' : '-'}Rs. {tx.amountPKR.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
