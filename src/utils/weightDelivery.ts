export interface WeightDeliveryResult {
  chargeableWeightKg: number;
  extraWeightKg: number;
  baseDeliveryPKR: number;
  extraDeliveryPKR: number;
  totalDeliveryPKR: number;
}

/**
 * Calculates delivery cost based on parcel weight.
 * Standard Pakistani courier tiering:
 * - First 0.5kg or 1.0kg is covered by baseRatePKR.
 * - Every additional 1.0kg or portion thereof adds extraPerKgPKR.
 */
export function calculateWeightDelivery(
  weightKg: number,
  baseRatePKR: number = 200,
  extraPerKgPKR: number = 65
): WeightDeliveryResult {
  const actualWeight = Math.max(0.1, Number(weightKg) || 0.5);
  // Round up to nearest 0.5kg chargeable weight
  const chargeableWeightKg = Math.ceil(actualWeight * 2) / 2;

  let extraDeliveryPKR = 0;
  const extraWeightKg = Math.max(0, chargeableWeightKg - 1.0);
  if (chargeableWeightKg > 1.0) {
    const extraKg = Math.ceil(extraWeightKg);
    extraDeliveryPKR = extraKg * extraPerKgPKR;
  }

  const totalDeliveryPKR = baseRatePKR + extraDeliveryPKR;

  return {
    chargeableWeightKg,
    extraWeightKg,
    baseDeliveryPKR: baseRatePKR,
    extraDeliveryPKR,
    totalDeliveryPKR,
  };
}
