import React, { useState } from 'react';
import {
  Package,
  Truck,
  Plus,
  DollarSign,
  TrendingUp,
  Layers,
  Edit2,
  CheckCircle,
  Clock,
  Settings,
  Warehouse,
  CheckSquare,
} from 'lucide-react';
import { Product, Order, User } from '../types';

interface SupplierPortalProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateCost: (productId: string, newCost: number) => void;
  onToggleActive: (productId: string) => void;
  onDispatchOrder: (orderId: string, courierName: string, trackingNumber?: string) => void;
  onBulkDispatchOrders?: (dispatches: Array<{ orderId: string; courierName: string; trackingNumber: string }>) => void;
  onBatchAcceptAndPack?: (orderIds: string[]) => void;
  onUpdateOrderStatus?: (orderId: string, status: any) => void;
  onWithdrawFunds?: (amount: number, method: string) => void;
  onSaveLogisticsConfig?: (cfg: any) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onUpdateStock,
  onUpdateCost,
  onToggleActive,
  onDispatchOrder,
  onBulkDispatchOrders,
  onBatchAcceptAndPack,
  onUpdateOrderStatus,
  onWithdrawFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'ORDERS' | 'FINANCE'>('INVENTORY');
  const [search, setSearch] = useState('');

  const supplierOrders = orders.filter((o) => o.supplierId === currentUser.id || !o.supplierId);
  const pendingOrders = supplierOrders.filter((o) => o.status === 'VERIFIED' || o.status === 'PENDING_VERIFICATION');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900 p-6 sm:p-8 border border-blue-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
              <Warehouse className="h-4 w-4" />
              <span>Supplier & Factory Logistics Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentUser.companyName || 'Verified Supplier Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage physical godown stock, accept reseller dropship orders, and upload bulk courier airway bills.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 text-right">
            <div className="text-xs text-slate-400">Available Payout Balance</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              Rs. {(currentUser.walletBalancePKR || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'INVENTORY' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Inventory & Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'ORDERS' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending Dispatches ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('FINANCE')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'FINANCE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Supplier Ledger
        </button>
      </div>

      {/* Content based on tab */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150'}
                    alt={p.name}
                    className="h-14 w-14 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{p.name}</h4>
                    <span className="font-mono text-[10px] text-cyan-400">{p.sku}</span>
                    <div className="text-xs font-semibold text-emerald-400">
                      Wholesale: Rs. {p.supplierCostPKR.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Current Stock:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateStock(p.id, Math.max(0, (p.stock || 0) - 10))}
                      className="h-6 w-6 rounded bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-white">{p.stock || 0}</span>
                    <button
                      onClick={() => onUpdateStock(p.id, (p.stock || 0) + 10)}
                      className="h-6 w-6 rounded bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400 text-xs">
              All wholesale dropship orders are dispatched! No pending parcels.
            </div>
          ) : (
            pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 border border-slate-800 p-4"
              >
                <div>
                  <div className="font-mono text-xs text-cyan-400 font-bold">{ord.orderNumber || ord.id}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{ord.productName}</div>
                  <div className="text-xs text-slate-400">
                    To: {ord.customerName} ({ord.customerCity}) • {ord.quantity || 1} units
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDispatchOrder(ord.id, 'TRAX', `TRX-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Quick Dispatch Trax
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'FINANCE' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Settlement Account Details</h3>
          <p className="text-xs text-slate-300">
            Wholesale disbursements are deposited bi-weekly via Raast or direct IBFT into your verified business bank account.
          </p>
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Bank Name:</span>
              <span className="text-white font-bold">Meezan Bank / Habib Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Title:</span>
              <span className="text-white font-bold">{currentUser.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Settled (30d):</span>
              <span className="text-emerald-400 font-bold font-mono">Rs. 892,400</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
