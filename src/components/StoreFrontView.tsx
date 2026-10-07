import React, { useState } from 'react';
import {
  ArrowLeft,
  Store,
  MapPin,
  CheckCircle,
  Star,
  Package,
  ShoppingBag,
  Truck,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Store as StoreType, Product, User, ProfitGuardConfig, BankTransferDetails } from '../types';

interface StoreFrontViewProps {
  store: StoreType;
  allProducts: Product[];
  currentUser: User;
  profitGuardConfig: ProfitGuardConfig;
  bankTransferDetails?: BankTransferDetails;
  onBack: () => void;
  onSelectProduct?: (product: Product) => void;
  onPlaceMultiOrder?: (
    items: Array<{ product: Product; quantity: number; sellingPrice: number }>,
    customerDetails: {
      customerName: string;
      customerPhone: string;
      customerCity: string;
      customerAddress: string;
    },
    totalAmountPKR: number
  ) => void;
  onPlaceBulkOrder?: (bulkData: any) => void;
}

export const StoreFrontView: React.FC<StoreFrontViewProps> = ({
  store,
  allProducts,
  currentUser,
  onBack,
  onSelectProduct,
  onPlaceMultiOrder,
}) => {
  const [search, setSearch] = useState('');

  // Products belonging to this store
  const storeProducts = allProducts.filter(
    (p) => p.storeId === store.id || p.supplierName === store.name || !p.storeId
  );

  const filtered = storeProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Stores</span>
      </button>

      {/* Store Banner & Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {store.banner && (
          <div className="h-44 sm:h-56 w-full overflow-hidden">
            <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-60" />
          </div>
        )}

        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 sm:-mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <img
              src={store.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={store.name}
              className="h-24 w-24 rounded-3xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-950"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{store.name}</h1>
                {store.isVerified && <CheckCircle className="h-5 w-5 text-emerald-400" />}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  {store.city}
                </span>
                <span>•</span>
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {store.rating || 4.9} Rating
                </span>
                <span>•</span>
                <span className="font-mono text-cyan-300">{store.verificationId || 'PK-MFR-VERIFIED'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 backdrop-blur-sm p-4 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400">Warehouse Address:</div>
            <div className="text-slate-200 font-medium">{store.warehouseAddress || 'Main Godown Hub'}</div>
            <div className="text-emerald-400 font-bold pt-1">{store.deliveryRating}</div>
          </div>
        </div>
      </div>

      {/* Catalog search */}
      <div className="flex items-center gap-2 max-w-md bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search this supplier's inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Products list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="group flex flex-col justify-between rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 transition shadow-lg"
          >
            <div>
              <div className="aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden mb-4">
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                  alt={prod.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-[11px] text-slate-400 mb-1">{prod.category}</div>
              <h4 className="font-bold text-white text-sm line-clamp-2">{prod.name}</h4>
              <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Wholesale</div>
                  <div className="font-extrabold text-white">Rs. {prod.supplierCostPKR.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Rec. Retail</div>
                  <div className="font-extrabold text-emerald-400">Rs. {prod.recSellingPricePKR.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProduct && onSelectProduct(prod)}
              className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              Order from Hub
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
