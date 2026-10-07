import React, { useState } from 'react';
import { RotateCcw, Package, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { Order } from '../types';

interface ReverseLogisticsRtoViewProps {
  orders: Order[];
  onRestockOrder?: (orderId: string) => void;
}

export const ReverseLogisticsRtoView: React.FC<ReverseLogisticsRtoViewProps> = ({
  orders,
  onRestockOrder,
}) => {
  const [restockedIds, setRestockedIds] = useState<string[]>([]);

  const rtoOrders = orders.filter((o) => o.status === 'RTO' || o.status === 'CANCELLED');
  const displayList = rtoOrders.length > 0 ? rtoOrders : orders.slice(0, 2);

  const handleRestock = (id: string) => {
    setRestockedIds((prev) => [...prev, id]);
    if (onRestockOrder) onRestockOrder(id);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-400">
            <RotateCcw className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Reverse Logistics & RTO Restocking Desk</h2>
            <p className="text-xs text-slate-300">
              Track undelivered customer parcels returned by Trax/PostEx, inspect physical condition, and restock to supplier godowns.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayList.map((ord) => {
          const isRestocked = restockedIds.includes(ord.id);
          return (
            <div
              key={ord.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 border border-slate-800 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400">{ord.orderNumber || ord.id}</span>
                  <span className="font-bold text-white text-sm">{ord.productName}</span>
                  <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 font-bold text-[10px] border border-amber-500/30">
                    Return to Hub
                  </span>
                </div>
                <div className="text-slate-400">
                  Refused by: {ord.customerName} ({ord.customerCity}) • Courier: {ord.courierName || 'TRAX'} • Tracking: {ord.trackingNumber || 'TRX-100234'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isRestocked ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Restocked to Inventory</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleRestock(ord.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 font-bold text-white shadow-lg transition cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    <span>Inspect & Restock (+1)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
