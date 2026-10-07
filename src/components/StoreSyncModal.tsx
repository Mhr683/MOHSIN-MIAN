import React from 'react';
import { X, RefreshCw, Store, CheckCircle, ExternalLink, Power } from 'lucide-react';
import { StoreIntegration } from '../types';

interface StoreSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreIntegration[];
  onToggleStoreConnection: (id: string) => void;
  onSyncNow: (id: string) => void;
}

export const StoreSyncModal: React.FC<StoreSyncModalProps> = ({
  isOpen,
  onClose,
  stores,
  onToggleStoreConnection,
  onSyncNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Multi-Store Sync Engine</h3>
              <p className="text-xs text-slate-400">Shopify, WooCommerce & Daraz automated inventory sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {stores.map((st) => (
            <div
              key={st.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{st.storeName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      st.connected
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {st.connected ? 'Active Sync' : 'Disconnected'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Platform: {st.platform}</span>
                  <span>•</span>
                  <span>Synced {st.productsSyncedCount || 0} products</span>
                  <span>•</span>
                  <span>Last: {st.lastSync || 'Recently'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSyncNow(st.id)}
                  disabled={!st.connected}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-3 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync</span>
                </button>
                <button
                  onClick={() => onToggleStoreConnection(st.id)}
                  className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    st.connected
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{st.connected ? 'Disconnect' : 'Connect'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <div className="font-bold text-slate-300">Automated Webhook Sync:</div>
          <p>
            When an order occurs on your Shopify store, it is automatically routed into YourMart Global for verification and dispatched by the supplier.
          </p>
        </div>
      </div>
    </div>
  );
};
