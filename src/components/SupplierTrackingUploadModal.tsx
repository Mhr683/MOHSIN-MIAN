import React, { useState } from 'react';
import { X, Truck, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Order, User } from '../types';

interface SupplierTrackingUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  orders: Order[];
  onDispatchOrder: (orderId: string, courierName: string, trackingNumber?: string) => void;
  onBulkDispatchOrders?: (dispatches: Array<{ orderId: string; courierName: string; trackingNumber: string }>) => void;
}

export const SupplierTrackingUploadModal: React.FC<SupplierTrackingUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onDispatchOrder,
  onBulkDispatchOrders,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [courierName, setCourierName] = useState('TRAX');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [activeMode, setActiveMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !trackingNumber.trim()) return;
    onDispatchOrder(selectedOrderId, courierName, trackingNumber.trim());
    setSuccessMsg(`Order ${selectedOrderId} dispatched with tracking ${trackingNumber.trim()} via ${courierName}!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkInput.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const dispatches: Array<{ orderId: string; courierName: string; trackingNumber: string }> = [];

    lines.forEach((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        dispatches.push({
          orderId: parts[0],
          courierName: parts[1] || 'TRAX',
          trackingNumber: parts[2] || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
    });

    if (dispatches.length > 0) {
      if (onBulkDispatchOrders) {
        onBulkDispatchOrders(dispatches);
      } else {
        dispatches.forEach((d) => onDispatchOrder(d.orderId, d.courierName, d.trackingNumber));
      }
      setSuccessMsg(`Successfully uploaded tracking for ${dispatches.length} orders!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Supplier Tracking ID Dispatch</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('SINGLE')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeMode === 'SINGLE'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Order Tracking
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('BULK')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeMode === 'BULK'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulk Paste / CSV
          </button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeMode === 'SINGLE' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Pending Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber || o.id} - {o.productName} ({o.customerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white"
              >
                <option value="TRAX">Trax Sonic Express</option>
                <option value="POSTEX">PostEx Rapid COD</option>
                <option value="TCS">TCS Express Pakistan</option>
                <option value="LEOPARDS">Leopards Courier</option>
                <option value="M&P">M&P Express Logistics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Airway Bill / Tracking Consignment #
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TRX-99214589"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition cursor-pointer"
            >
              Confirm Dispatch & Activate Live Tracking
            </button>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paste Format: <span className="font-mono text-cyan-400">OrderID, Courier, Tracking#</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="ord-101, TRAX, TRX-9921827&#10;ord-102, POSTEX, PST-5541923"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition cursor-pointer"
            >
              Process Bulk Tracking Dispatch
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
