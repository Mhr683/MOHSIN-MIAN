import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Package,
  Truck,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Product, ProfitGuardConfig } from '../types';
import { calculateRealProfit } from '../utils/realProfitCalculator';

interface PricingEngineViewProps {
  products: Product[];
  profitGuardConfig: ProfitGuardConfig;
  onSelectProductForOrder?: (product: Product, price: number) => void;
}

export const PricingEngineView: React.FC<PricingEngineViewProps> = ({
  products,
  profitGuardConfig,
  onSelectProductForOrder,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || ({} as Product));
  const [sellingPrice, setSellingPrice] = useState<number>(selectedProduct?.recSellingPricePKR || 2499);
  const [supplierCost, setSupplierCost] = useState<number>(selectedProduct?.supplierCostPKR || 1000);
  const [shippingCost, setShippingCost] = useState<number>(profitGuardConfig.defaultShippingCostPKR || 200);
  const [platformFeePct, setPlatformFeePct] = useState<number>(profitGuardConfig.platformFeePct || 2.0);
  const [discount, setDiscount] = useState<number>(0);
  const [estimatedAdCost, setEstimatedAdCost] = useState<number>(350); // Meta/TikTok CPA
  const [expectedRtoRatePct, setExpectedRtoRatePct] = useState<number>(10); // 10% Pakistan COD average
  const [rtoLossPKR, setRtoLossPKR] = useState<number>(250);

  const calc = calculateRealProfit({
    sellingPricePKR: sellingPrice,
    productCostPKR: supplierCost,
    shippingCostPKR: shippingCost,
    platformFeePct: platformFeePct,
    discountPKR: discount,
    estimatedAdCostPKR: estimatedAdCost,
    expectedRtoRatePct: expectedRtoRatePct,
    rtoReturnShippingLossPKR: rtoLossPKR,
  });

  const handleProductChange = (prodId: string) => {
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setSelectedProduct(found);
      setSupplierCost(found.supplierCostPKR);
      setSellingPrice(found.recSellingPricePKR || found.supplierCostPKR * 2);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <Calculator className="h-4 w-4" />
              <span>Real Profit Guard Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              True Net Profit & Break-Even Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Calculate actual pocket profit after Supplier Cost, Courier Freight, COD Collection Fee, Platform 2%, Ad CPA, and Doorstep RTO Return Freight losses.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 text-center sm:text-right">
            <div className="text-xs text-slate-400">Break-Even Minimum Price</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              Rs. {calc.breakEvenSellingPricePKR.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 p-6 border border-slate-800 space-y-4 text-xs shadow-xl">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Sourced Product</label>
            <select
              value={selectedProduct?.id}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Wholesale: Rs. {p.supplierCostPKR})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Selling Retail Price (PKR)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Supplier Godown Cost (PKR)</label>
              <input
                type="number"
                value={supplierCost}
                onChange={(e) => setSupplierCost(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Base Courier Shipping</label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Estimated Ad CPA (PKR)</label>
              <input
                type="number"
                value={estimatedAdCost}
                onChange={(e) => setEstimatedAdCost(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Discount Given (PKR)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-slate-400 mb-1">Expected Return (RTO) Rate (%)</label>
              <input
                type="number"
                value={expectedRtoRatePct}
                onChange={(e) => setExpectedRtoRatePct(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Average in Pakistan is 10-15%</span>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">RTO Return Freight Loss (PKR)</label>
              <input
                type="number"
                value={rtoLossPKR}
                onChange={(e) => setRtoLossPKR(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Courier return charge</span>
            </div>
          </div>
        </div>

        {/* Right Calculation Result Card */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 p-6 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Full Cost Waterfall</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  calc.isProfitable
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {calc.verdict.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Customer Selling Price:</span>
                <span className="font-bold text-white">Rs. {calc.sellingPricePKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Supplier Wholesale Cost:</span>
                <span className="text-red-400">-Rs. {calc.productCostPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Courier Delivery Freight:</span>
                <span className="text-red-400">-Rs. {calc.shippingCostPKR}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Courier COD Collection Fee:</span>
                <span className="text-red-400">-Rs. {calc.codFeePKR}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- YourMart Platform Fee ({platformFeePct}%):</span>
                <span className="text-red-400">-Rs. {calc.platformFeePKR}</span>
              </div>
              {calc.adCostPKR > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>- Estimated Ad Spend (CPA):</span>
                  <span className="text-red-400">-Rs. {calc.adCostPKR}</span>
                </div>
              )}
              {calc.estimatedRtoLossPerOrderPKR > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>- RTO Return Risk Buffer:</span>
                  <span className="text-red-400">-Rs. {calc.estimatedRtoLossPerOrderPKR}</span>
                </div>
              )}
              <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-200 font-bold">
                <span>Total Deductions per Parcel:</span>
                <span className="text-red-400">-Rs. {calc.totalDirectCostsPKR.toLocaleString()}</span>
              </div>
            </div>

            {/* Real Net Profit in Pocket */}
            <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 text-center space-y-1">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                Real Estimated Net Profit per Delivered Order
              </div>
              <div
                className={`text-3xl font-black font-mono ${
                  calc.estimatedRealNetProfitPKR > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                Rs. {calc.estimatedRealNetProfitPKR.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                Net Margin:{' '}
                <span className="font-bold text-white">{calc.realNetProfitMarginPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {onSelectProductForOrder && (
            <button
              onClick={() => onSelectProductForOrder(selectedProduct, sellingPrice)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
            >
              <span>Place Order at Rs. {sellingPrice.toLocaleString()}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
