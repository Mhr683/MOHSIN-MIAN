import React from 'react';
import {
  TrendingUp,
  Package,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Users,
  Calculator,
  ShieldAlert,
  Store,
  Wallet,
} from 'lucide-react';
import { Order, Product, User } from '../types';

interface FrontPageDashboardProps {
  orders: Order[];
  products: Product[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct?: () => void;
  onOpenProfileSettings?: () => void;
  onOpenStoreSyncModal?: () => void;
}

export const FrontPageDashboard: React.FC<FrontPageDashboardProps> = ({
  orders,
  products,
  currentUser,
  onNavigateTab,
  onOpenAddProduct,
  onOpenProfileSettings,
  onOpenStoreSyncModal,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.sellingPricePKR || 0), 0);
  const totalMargin = orders.reduce((sum, o) => sum + (o.resellerMarginPKR || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const inTransitCount = orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT').length;
  const rtoCount = orders.filter((o) => o.status === 'RTO' || o.status === 'RETURNED').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-cyan-900/40 to-slate-900 p-6 sm:p-10 border border-emerald-500/30 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="h-4 w-4" />
              <span>Profit Guard Protected Wholesale Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{currentUser?.name || 'Partner'}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated Pakistan-wide dropshipping: Direct manufacturer sourcing, Trax / PostEx / TCS COD dispatch, automated verification, and instant profit settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('catalog')}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigateTab('courier-dispatch')}
              className="flex items-center gap-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-sm font-bold text-slate-200 transition cursor-pointer"
            >
              <Truck className="h-4 w-4 text-cyan-400" />
              <span>Courier Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigateTab('orders')}
          className="rounded-3xl bg-slate-900/90 p-6 border border-slate-800 hover:border-cyan-500/50 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Orders Volume</span>
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 group-hover:scale-110 transition">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Across {orders.length} registered orders
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('payouts')}
          className="rounded-3xl bg-slate-900/90 p-6 border border-slate-800 hover:border-emerald-500/50 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Reseller Margin</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-110 transition">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            Rs. {totalMargin.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Wallet Balance: Rs. {(currentUser?.walletBalancePKR || 0).toLocaleString()}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('courier-dispatch')}
          className="rounded-3xl bg-slate-900/90 p-6 border border-slate-800 hover:border-blue-500/50 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active In-Transit</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400 group-hover:scale-110 transition">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{inTransitCount} Parcels</div>
          <div className="text-xs text-slate-400 mt-1">
            {deliveredCount} delivered • {rtoCount} RTO returns
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('catalog')}
          className="rounded-3xl bg-slate-900/90 p-6 border border-slate-800 hover:border-indigo-500/50 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 group-hover:scale-110 transition">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{products.length} Products</div>
          <div className="text-xs text-slate-400 mt-1">
            100% verified wholesale godowns
          </div>
        </div>
      </div>

      {/* Operational Pipeline Quick Launch Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-cyan-400" />
          <span>Core Operational Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 group-hover:scale-110 transition">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                1. Sourcing Catalog
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Browse products with live profit margins & stock checks.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400 group-hover:scale-110 transition">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition">
                2. Order Management
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Process orders through the full COD verification pipeline.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('courier-dispatch')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400 group-hover:scale-110 transition">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-blue-400 transition">
                3. Courier Dispatch
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Book Trax/PostEx, print 4x6 thermal slips, and track.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('pricing-engine')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400 group-hover:scale-110 transition">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                4. Real Profit Guard
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Net margin simulator accounting for RTO, Ads & COD fees.
              </div>
            </div>
          </button>
        </div>

        {/* Second Row of Core Hubs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <button
            onClick={() => onNavigateTab('customers')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 group-hover:scale-110 transition">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                Customer Database
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Track buyer histories, addresses & fraud risk profiles.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('fraud-blacklist')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-red-500/10 p-3 text-red-400 group-hover:scale-110 transition">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-red-400 transition">
                COD Fraud Shield
              </div>
              <div className="text-xs text-slate-400 mt-1">
                National RTO blacklist & advance payment rules.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('reverse-logistics')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400 group-hover:scale-110 transition">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                RTO & Returns
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Manage refused parcels, inspection & restock.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('payouts')}
            className="flex items-start gap-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 p-5 text-left transition group cursor-pointer shadow-md"
          >
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 group-hover:scale-110 transition">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                Wallet & Payouts
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Automated clearances via JazzCash, EasyPaisa & Raast.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
