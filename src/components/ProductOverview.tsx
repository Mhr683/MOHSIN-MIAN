import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingCart,
  TrendingUp,
  Download,
  ExternalLink,
  Layers,
  Store as StoreIcon,
  CheckCircle,
  Copy
} from 'lucide-react';
import { Product, ProfitGuardConfig, User, StoreIntegration, BankTransferDetails } from '../types';

interface ProductOverviewProps {
  product: Product;
  allProducts: Product[];
  currentUser: User;
  profitGuardConfig: ProfitGuardConfig;
  bankTransferDetails?: BankTransferDetails;
  stores?: StoreIntegration[];
  onBackToProducts: () => void;
  onSelectProduct: (product: Product) => void;
  onPlaceSampleOrder: (
    product: Product,
    sellingPrice: number,
    customerDetails: {
      customerName: string;
      customerPhone?: string;
      customerCity?: string;
      customerAddress?: string;
    }
  ) => void;
  onPushToStore: (product: Product, storePlatform: string, sellingPrice: number) => void;
  onOpenStoreFront?: (storeId?: string) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  allProducts,
  currentUser,
  profitGuardConfig,
  stores = [],
  onBackToProducts,
  onSelectProduct,
  onPlaceSampleOrder,
  onPushToStore,
  onOpenStoreFront,
  onAddToCart,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  );
  const [sellingPrice, setSellingPrice] = useState<number>(product.recSellingPricePKR || 2000);
  const [copied, setCopied] = useState(false);
  const [orderName, setOrderName] = useState('Walk-in Customer');
  const [orderPhone, setOrderPhone] = useState('0300-1234567');
  const [orderCity, setOrderCity] = useState('Lahore');
  const [orderAddress, setOrderAddress] = useState('Main Bazaar');
  const [showOrderForm, setShowOrderForm] = useState(false);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image || selectedImage];

  const supplierCost = product.supplierCostPKR;
  const shippingCost = profitGuardConfig.defaultShippingCostPKR || 200;
  const platformFee = Math.round((sellingPrice * (profitGuardConfig.platformFeePct || 2.0)) / 100);
  const processingFee = profitGuardConfig.processingFeePKR || 30;
  const totalCost = supplierCost + shippingCost + platformFee + processingFee;
  const netMargin = sellingPrice - totalCost;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceSampleOrder(product, sellingPrice, {
      customerName: orderName,
      customerPhone: orderPhone,
      customerCity: orderCity,
      customerAddress: orderAddress,
    });
    setShowOrderForm(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Back button & Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToProducts}
          className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Product Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>
          {onOpenStoreFront && product.storeId && (
            <button
              onClick={() => onOpenStoreFront(product.storeId)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 px-3 py-2 text-xs font-semibold text-indigo-300 transition"
            >
              <StoreIcon className="h-4 w-4" />
              <span>Visit Supplier Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Main product display grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 backdrop-blur-sm">
        {/* Left: Gallery & Video */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
            />
            {product.isTrending && (
              <span className="absolute top-4 left-4 bg-amber-500/90 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> High Demand Winner
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img
                      ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product video preview if available */}
          {product.videoUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Commercial Video Ad Demo
                </span>
                <span className="text-emerald-400 font-mono">1080p HD Ready</span>
              </div>
              <video
                src={product.videoUrl}
                controls
                className="w-full rounded-xl max-h-56 object-cover bg-black"
              />
            </div>
          )}
        </div>

        {/* Right: Pricing, Profit Calculator, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <span>{product.category || 'General Wholesale'}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">{product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verified Supplier:{' '}
              <span className="text-slate-200 font-medium">{product.supplierName || 'Hall Road Mega Hub'}</span>
            </p>
          </div>

          {/* Live Profit Guard Simulator Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Profit Guard Real Net Margin
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Safe Margin
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">Wholesale Cost</div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  Rs. {supplierCost.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">COD Delivery</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-300">
                  Rs. {shippingCost}
                </div>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">Fees (Platform 2%)</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-300">
                  Rs. {platformFee + processingFee}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-950/40 p-2.5 border border-emerald-500/40">
                <div className="text-[10px] text-emerald-300 font-bold">Your Net Profit</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                  Rs. {netMargin.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-300 font-semibold">Reseller Selling Price (PKR):</label>
                <span className="font-bold text-emerald-400 font-mono">Rs. {sellingPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={supplierCost + shippingCost + 100}
                max={supplierCost * 3 + 1000}
                step={50}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Highlights & specs */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product Highlights</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowOrderForm(!showOrderForm)}
                className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <Truck className="h-4 w-4" />
                <span>{showOrderForm ? 'Close Form' : 'Book Direct COD Order'}</span>
              </button>

              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(product, 1)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 text-sm font-bold text-slate-100 transition cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>

            {/* Push to Connected Store buttons */}
            {stores.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {stores.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onPushToStore(product, st.platform, sellingPrice)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3 text-cyan-400" />
                    <span>Sync to {st.storeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Order Form */}
          {showOrderForm && (
            <form onSubmit={handleQuickOrderSubmit} className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-200">Customer Delivery Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Customer Full Name"
                  required
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="0300-0000000"
                  required
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="City (e.g. Lahore)"
                  required
                  value={orderCity}
                  onChange={(e) => setOrderCity(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Complete Address"
                  required
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                Confirm & Dispatch COD Order (Rs. {sellingPrice.toLocaleString()})
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
