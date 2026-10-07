/**
 * Generates official courier parcel tracking links for Pakistani logistics providers.
 */
export function getCourierTrackingUrl(courierName?: string, trackingNumber?: string): string {
  const code = (courierName || '').toUpperCase();
  const trackNum = encodeURIComponent(trackingNumber || 'TRX-100234');

  if (code.includes('TRAX')) {
    return `https://trax.pk/tracking?tracking_number=${trackNum}`;
  }
  if (code.includes('POSTEX')) {
    return `https://postex.pk/tracking?cn=${trackNum}`;
  }
  if (code.includes('TCS')) {
    return `https://www.tcsexpress.com/tracking?track_number=${trackNum}`;
  }
  if (code.includes('LEOPARDS') || code.includes('LCS')) {
    return `https://leopardscourier.com/track/${trackNum}`;
  }
  if (code.includes('M&P') || code.includes('MNP')) {
    return `https://mulphilog.com/tracking?consignment=${trackNum}`;
  }
  return `https://trax.pk/tracking?tracking_number=${trackNum}`;
}

/**
 * Builds direct WhatsApp URL with pre-filled Urdu & English shipping alert.
 */
export function getWhatsAppTrackingShareUrl(
  phone: string,
  customerName: string = 'Valued Customer',
  orderNumber: string = 'YM-Order',
  courierName: string = 'Trax Express',
  trackingNumber: string = 'TRX-10293',
  amount?: number
): string {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '92' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('92')) {
    formattedPhone = '92' + formattedPhone;
  }

  const trackingLink = getCourierTrackingUrl(courierName, trackingNumber);
  const amountStr = amount ? `*Rs. ${amount.toLocaleString()}*` : 'Cash on Delivery';

  const message = `السلام علیکم ${customerName}! 📦\n\nآپ کا آرڈر *#${orderNumber}* روانہ کر دیا گیا ہے۔\n\n🔹 کورئیر: *${courierName}*\n🔹 ٹریکنگ نمبر: *${trackingNumber}*\n🔹 ادا کی جانے والی رقم: ${amountStr}\n\nپارسل لائیو ٹریک کرنے کیلئے لنک کھولیں:\n${trackingLink}\n\nبراہ کرم ڈیلیوری بوائے آنے پر فون سنیں اور رقم تیار رکھیں۔ شکریہ! 🙏`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
