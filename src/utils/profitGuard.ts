import { ProfitGuardConfig } from '../types';

export interface OrderFinancialInputs {
  sellingPricePKR: number;
  supplierCostPKR: number;
  shippingCostPKR?: number;
  processingFeePKR?: number;
  platformFeePct?: number;
  codFeePKR?: number;
}

export interface FinancialBreakdown {
  sellingPricePKR: number;
  supplierCostPKR: number;
  shippingCostPKR: number;
  processingFeePKR: number;
  platformFeePKR: number;
  codFeePKR: number;
  totalCostPKR: number;
  grossMarginPKR: number;
  resellerNetProfitPKR: number;
  netMarginPct: number;
  profitMarginPct: number;
}

export interface ProfitGuardEvaluation {
  isSafe: boolean;
  approved: boolean;
  reason?: string;
  financials: FinancialBreakdown;
  warnings: string[];
  blockReason?: string;
}

export function evaluateOrderFinancials(
  inputs: OrderFinancialInputs,
  config?: ProfitGuardConfig
): ProfitGuardEvaluation {
  const sellingPrice = Math.max(0, inputs.sellingPricePKR || 0);
  const supplierCost = Math.max(0, inputs.supplierCostPKR || 0);
  const shippingCost = inputs.shippingCostPKR ?? config?.defaultShippingCostPKR ?? 200;
  const processingFee = inputs.processingFeePKR ?? config?.processingFeePKR ?? 30;
  const platformFeePct = inputs.platformFeePct ?? config?.platformFeePct ?? 2.0;
  const platformFee = Math.round((sellingPrice * platformFeePct) / 100);
  const codFee = inputs.codFeePKR ?? Math.max(35, Math.round(sellingPrice * 0.015));

  const totalCost = supplierCost + shippingCost + processingFee + platformFee;
  const resellerNetProfit = sellingPrice - totalCost;
  const grossMargin = sellingPrice - supplierCost;
  const netMarginPct = sellingPrice > 0 ? (resellerNetProfit / sellingPrice) * 100 : 0;

  const minProfitPKR = config?.minProfitAmountPKR ?? 150;
  const minMarginPct = config?.minProfitMarginPct ?? 10;

  const warnings: string[] = [];
  let isSafe = true;
  let blockReason: string | undefined;

  if (resellerNetProfit < 0) {
    isSafe = false;
    blockReason = `Negative profit margin! Reseller will lose Rs. ${Math.abs(resellerNetProfit).toLocaleString()} on this order.`;
    warnings.push(blockReason);
  } else if (resellerNetProfit < minProfitPKR) {
    warnings.push(`Profit of Rs. ${resellerNetProfit.toLocaleString()} is below minimum target of Rs. ${minProfitPKR}.`);
    if (config?.enforceLock) {
      isSafe = false;
      blockReason = `Order locked by Profit Guard: Net profit Rs. ${resellerNetProfit} is below threshold Rs. ${minProfitPKR}.`;
    }
  }

  if (netMarginPct < minMarginPct) {
    warnings.push(`Margin of ${netMarginPct.toFixed(1)}% is below healthy retail threshold of ${minMarginPct}%.`);
  }

  return {
    isSafe,
    approved: isSafe,
    reason: blockReason || warnings[0] || 'Profit margin verified',
    financials: {
      sellingPricePKR: sellingPrice,
      supplierCostPKR: supplierCost,
      shippingCostPKR: shippingCost,
      processingFeePKR: processingFee,
      platformFeePKR: platformFee,
      codFeePKR: codFee,
      totalCostPKR: totalCost,
      grossMarginPKR: grossMargin,
      resellerNetProfitPKR: resellerNetProfit,
      netMarginPct: Math.round(netMarginPct * 10) / 10,
      profitMarginPct: Math.round(netMarginPct * 10) / 10,
    },
    warnings,
    blockReason,
  };
}
