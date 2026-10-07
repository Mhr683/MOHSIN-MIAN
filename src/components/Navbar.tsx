import React, { useState } from 'react';
import {
  Menu,
  X,
  Wallet,
  ShoppingCart,
  Globe,
  Lock,
  Unlock,
  User as UserIcon,
  LayoutGrid,
  ShoppingBag,
  Building2,
  Boxes,
  Truck,
  RotateCcw,
  ShieldAlert,
  FileCheck,
  Calculator,
  Users,
  Banknote,
  Sliders,
  Database,
  MessageSquare,
  BookOpen,
  Store as StoreIcon,
  Printer,
  Bell,
} from 'lucide-react';
import { User, StoreIntegration } from '../types';
import { AppLanguage } from '../context/LanguageContext';

export type NavbarTab =
  | 'dashboard'
  | 'catalog'
  | 'orders'
  | 'courier-dispatch'
  | 'supplier-hub'
  | 'supplier-inventory'
  | 'customers'
  | 'payouts'
  | 'pricing-engine'
  | 'fraud-blacklist'
  | 'reverse-logistics'
  | 'courier-reconciliation'
  | 'public-tracking'
  | 'store-front'
  | 'support-tickets'
  | 'knowledge-center'
  | 'business-rules'
  | 'audit-log'
  | 'admin-hq';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingOrdersCount: number;
  cartCount: number;
  currentUser: User;
  isAdminAuthenticated?: boolean;
  language?: AppLanguage;
  onToggleLanguage?: (lang: AppLanguage) => void;
  onOpenBatchPrinter?: () => void;
  onOpenWalletModal?: () => void;
  onOpenCart?: () => void;
  onOpenAdminAuth?: () => void;
  onLockAdmin?: () => void;
  onOpenProfile?: () => void;
  onOpenLocationSelector?: () => void;
  onOpenNotifications?: () => void;
  stores?: StoreIntegration[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount,
  cartCount,
  currentUser,
  isAdminAuthenticated = false,
  language = 'en',
  onToggleLanguage,
  onOpenBatchPrinter,
  onOpenWalletModal,
  onOpenCart,
  onOpenAdminAuth,
  onLockAdmin,
  onOpenProfile,
  onOpenLocationSelector,
  onOpenNotifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: NavbarTab;
    label: string;
    subLabel: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subLabel: 'Overview & Metrics',
      icon: LayoutGrid,
    },
    {
      id: 'catalog',
      label: 'Products',
      subLabel: 'Wholesale Catalog',
      icon: ShoppingBag,
    },
    {
      id: 'orders',
      label: 'Orders',
      subLabel: 'COD Pipeline',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'courier-dispatch',
      label: 'Courier Dispatch',
      subLabel: 'Trax • PostEx • TCS',
      icon: Truck,
    },
    {
      id: 'supplier-hub',
      label: 'Suppliers',
      subLabel: 'Godowns & Factories',
      icon: Building2,
    },
    {
      id: 'customers',
      label: 'Customers',
      subLabel: 'Risk & Delivery History',
      icon: Users,
    },
    {
      id: 'pricing-engine',
      label: 'Real Profit',
      subLabel: 'Net Margin Simulator',
      icon: Calculator,
    },
    {
      id: 'fraud-blacklist',
      label: 'Fraud Shield',
      subLabel: 'RTO Risk Blacklist',
      icon: ShieldAlert,
    },
    {
      id: 'reverse-logistics',
      label: 'RTO & Returns',
      subLabel: 'Claims & Restocking',
      icon: RotateCcw,
    },
    {
      id: 'payouts',
      label: 'Wallet & Payouts',
      subLabel: 'JazzCash • EasyPaisa',
      icon: Banknote,
    },
    {
      id: 'courier-reconciliation',
      label: 'Reconciliation',
      subLabel: 'Settlement Auditing',
      icon: FileCheck,
    },
    {
      id: 'public-tracking',
      label: 'Parcel Tracking',
      subLabel: 'Universal Courier Lookup',
      icon: Truck,
    },
    {
      id: 'store-front',
      label: 'Public Store',
      subLabel: 'Retail Storefront',
      icon: StoreIcon,
    },
    {
      id: 'support-tickets',
      label: 'Disputes',
      subLabel: 'Claims Desk',
      icon: MessageSquare,
    },
    {
      id: 'knowledge-center',
      label: 'Academy',
      subLabel: 'Dropshipping Playbook',
      icon: BookOpen,
    },
    {
      id: 'business-rules',
      label: 'Rules',
      subLabel: 'Platform Tariffs',
      icon: Sliders,
    },
    {
      id: 'audit-log',
      label: 'Audit Trail',
      subLabel: 'Security Logs',
      icon: Database,
    },
  ];

  const handleSelect = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  const walletBalance = currentUser.walletBalancePKR ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 text-white shadow-lg">
      {/* Top Primary Header Bar */}
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Left Brand and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            title="Open Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 font-black text-slate-950 shadow-md shadow-emerald-500/20 text-lg">
              YM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">YourMart</span>
                <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                  PAKISTAN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">B2B Dropshipping & COD Automation</p>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          {/* Cart Drawer Button */}
          {onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-300 transition cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Wallet Balance Widget */}
          {onOpenWalletModal && (
            <button
              type="button"
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:border-emerald-500/50 px-3 py-1.5 text-left transition cursor-pointer"
            >
              <Wallet className="h-4 w-4 text-emerald-400" />
              <div className="hidden sm:block">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Wallet
                </p>
                <p className="text-xs font-extrabold text-emerald-400 font-mono">
                  PKR {walletBalance.toLocaleString()}
                </p>
              </div>
            </button>
          )}

          {/* Language Switcher */}
          {onToggleLanguage && (
            <button
              type="button"
              onClick={() =>
                onToggleLanguage(
                  language === 'en' ? 'ur' : language === 'ur' ? 'roman-urdu' : 'en'
                )
              }
              className="hidden md:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-2.5 py-2 text-[11px] font-bold text-slate-300 transition cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span className="uppercase">{language === 'ur' ? 'اردو' : language}</span>
            </button>
          )}

          {/* Location Selector Button */}
          {onOpenLocationSelector && (
            <button
              type="button"
              onClick={onOpenLocationSelector}
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-2.5 py-2 text-xs font-bold text-slate-300 transition cursor-pointer"
              title="Pakistan Delivery Cities & Serviceability"
            >
              <Truck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Cities</span>
            </button>
          )}

          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* User Profile */}
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-2.5 py-2 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name}</span>
            </button>
          )}

          {/* Admin HQ Access */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSelect('admin-hq')}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'admin-hq'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Unlock className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Admin HQ</span>
              </button>
              {onLockAdmin && (
                <button
                  type="button"
                  onClick={onLockAdmin}
                  className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-2 text-rose-300 hover:bg-rose-500/25 transition cursor-pointer"
                  title="Lock Admin"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : onOpenAdminAuth ? (
            <button
              type="button"
              onClick={onOpenAdminAuth}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition cursor-pointer"
              title="Admin HQ Login"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Horizontal Nav Scroll Tab Strip */}
      <div className="border-t border-slate-800/80 bg-slate-900/90">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-2 overflow-x-auto px-4 py-1.5 sm:px-6 no-scrollbar">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                        active
                          ? 'bg-slate-950 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Thermal Slips Batch Print Quick Button */}
          {onOpenBatchPrinter && (
            <div className="hidden 2xl:flex items-center pl-2 border-l border-slate-800 shrink-0">
              <button
                type="button"
                onClick={onOpenBatchPrinter}
                className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 transition cursor-pointer"
              >
                <Printer className="h-3 w-3 text-cyan-400" />
                <span>Batch Labels</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-72 flex-col bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-sm font-black text-white">YourMart Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                      active
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="text-left">
                        <div>{item.label}</div>
                        <div className={`text-[10px] ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                          {item.subLabel}
                        </div>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
