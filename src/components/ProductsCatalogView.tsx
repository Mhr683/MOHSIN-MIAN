import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { Product, ProfitGuardConfig, User } from '../types';

interface ProductsCatalogViewProps {
  products: Product[];
  currentUser: User;
  profitGuardConfig: ProfitGuardConfig;
  onSelectProduct: (product: Product) => void;
  onOpenAddProduct?: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onOpenStoreFront?: (storeId?: string) => void;
}

export const ProductsCatalogView: React.FC<ProductsCatalogViewProps> = ({
  products,
  currentUser,
  profitGuardConfig,
  onSelectProduct,
  onOpenAddProduct,
  onAddToCart,
  onOpenStoreFront,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.supplierName || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStock = !inStockOnly || (p.stock || 0) > 0;
    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="h-4 w-4" />
              <span>Verified Wholesale Sourcing Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dropshipping Products Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Source verified items directly from Hall Road, Bolton Market & Raja Bazaar godowns. All products feature pre-negotiated wholesale rates and guaranteed 7-day warranty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAddProduct && (
              <button
                onClick={onOpenAddProduct}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>List / Add Product</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 rounded accent-emerald-500"
            />
            <span>In Stock Only</span>
          </label>
        </div>

        <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((prod) => {
          const sellingPrice = prod.recSellingPricePKR || prod.supplierCostPKR * 2;
          const grossProfit = sellingPrice - prod.supplierCostPKR - (profitGuardConfig.defaultShippingCostPKR || 200);

          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group flex flex-col justify-between rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden mb-4 border border-slate-800">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={prod.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Est. Margin Rs. {grossProfit.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prod.category}</span>
                    <span className="font-mono text-cyan-400">{prod.sku}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-emerald-400 transition">
                    {prod.name}
                  </h3>

                  <div className="text-[11px] text-slate-400">
                    Supplier: <span className="text-slate-200">{prod.supplierName || 'Hall Road Hub'}</span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Wholesale Cost</div>
                      <div className="font-bold text-slate-200">
                        Rs. {prod.supplierCostPKR.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Rec. Retail</div>
                      <div className="font-extrabold text-emerald-400 font-mono">
                        Rs. {sellingPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">
                  Stock: <span className="font-bold text-white font-mono">{prod.stock || 0}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) onAddToCart(prod, 1);
                    else onSelectProduct(prod);
                  }}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Sell Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
