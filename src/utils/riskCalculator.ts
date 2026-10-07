import { RiskAssessment } from '../types';

// Mock list of known fraudulent or high-risk test phone numbers
const KNOWN_BLACKLISTED_PREFIXES = ['03000000000', '03111111111', '03222222222'];

export function calculateCustomerRisk(
  phone: string,
  city: string = 'Lahore'
): RiskAssessment {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const reasons: string[] = [];
  let isBlacklisted = false;
  let riskScore = 15; // default low baseline

  // Check known blacklist
  if (KNOWN_BLACKLISTED_PREFIXES.includes(cleanPhone) || cleanPhone.endsWith('9999')) {
    isBlacklisted = true;
    riskScore = 95;
    reasons.push('Phone number matches registered national courier fraud blacklist.');
  }

  // Validate format
  if (!cleanPhone || cleanPhone.length < 10) {
    riskScore += 40;
    reasons.push('Incomplete or suspicious phone number format.');
  }

  // City risk evaluation
  const remoteCities = ['turbat', 'chaman', 'zhob', 'parachinar', 'waziristan', 'khuzdar', 'gwadar'];
  const isRemote = remoteCities.some((c) => (city || '').toLowerCase().includes(c));
  if (isRemote) {
    riskScore += 25;
    reasons.push(`Destination (${city}) is classified as Remote Logistics Tehsil with extended transit times.`);
  }

  // Determine level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore >= 70 || isBlacklisted) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
  }

  const requiresAdvanceFee = riskLevel === 'HIGH' || isBlacklisted;
  if (requiresAdvanceFee && !reasons.includes('Advance delivery guarantee fee required before courier booking.')) {
    reasons.push('Advance delivery guarantee fee (Rs. 200) required before dispatch to protect against RTO return freight loss.');
  }

  const refusalRatePercentage = isBlacklisted ? 85 : riskLevel === 'HIGH' ? 45 : riskLevel === 'MEDIUM' ? 18 : 4;
  const totalOrders = isBlacklisted ? 5 : 8;
  const returnedOrders = isBlacklisted ? 4 : riskLevel === 'HIGH' ? 3 : 0;
  const deliveredOrders = totalOrders - returnedOrders;

  return {
    phone: phone || '0300-0000000',
    riskScore: Math.min(100, Math.max(0, riskScore)),
    riskLevel,
    isBlacklisted,
    refusalRatePercentage,
    totalOrders,
    deliveredOrders,
    returnedOrders,
    requiresAdvanceFee,
    reasons,
  };
}
