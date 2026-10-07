import React, { useState } from 'react';
import { X, ShieldCheck, DollarSign, Percent, Lock, Save, AlertTriangle } from 'lucide-react';
import { ProfitGuardConfig } from '../types';

interface ProfitGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfitGuardConfig;
  onSaveConfig: (newConfig: ProfitGuardConfig) => void;
}

export const ProfitGuardModal: React.FC<ProfitGuardModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [minProfit, setMinProfit] = useState(config.minProfitAmountPKR || 150);
  const [minMargin, setMinMargin] = useState(config.minProfitMarginPct || 10);
  const [platformFee, setPlatformFee] = useState(config.platformFeePct || 2.0);
  const [processingFee, setProcessingFee] = useState(config.processingFeePKR || 30);
  const [defaultShipping, setDefaultShipping] = useState(config.defaultShippingCostPKR || 200);
  const [enforceLock, setEnforceLock] = useState(config.enforceLock ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      minProfitAmountPKR: Number(minProfit),
      minProfitMarginPct: Number(minMargin),
      platformFeePct: Number(platformFee),
      processingFeePKR: Number(processingFee),
      defaultShippingCostPKR: Number(defaultShipping),
      enforceLock,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Profit Guard Engine Rules</h3>
              <p className="text-xs text-slate-400">Automated margin protection against negative balances</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Minimum Reseller Profit per Order (PKR)
            </label>
            <input
              type="number"
              value={minProfit}
              onChange={(e) => setMinProfit(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Orders yielding less than this amount trigger warning or hard lock.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Platform Software Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Order Processing Fee (PKR)</label>
              <input
                type="number"
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Default Base COD Shipping (PKR)</label>
            <input
              type="number"
              value={defaultShipping}
              onChange={(e) => setDefaultShipping(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="enforceLock"
              checked={enforceLock}
              onChange={(e) => setEnforceLock(e.target.checked)}
              className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="enforceLock" className="text-slate-300 font-semibold cursor-pointer">
              Enforce Hard Lock (Block orders that produce zero or negative profit)
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Profit Guard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
