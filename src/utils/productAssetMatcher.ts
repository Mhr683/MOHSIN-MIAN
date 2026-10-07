export interface SmartProductAssetPack {
  image: string;
  extraImages: string[];
  videoUrl: string;
  videoTitle: string;
  category?: string;
  categoryHint?: string;
  highlights?: string[];
  urduPitch?: string;
}

export function getSmartProductAssets(productName: string = ''): SmartProductAssetPack {
  const lower = (productName || '').toLowerCase();

  if (lower.includes('trimmer') || lower.includes('shaver') || lower.includes('clipper') || lower.includes('t9')) {
    return {
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800',
      extraImages: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-with-a-hair-clipper-42468-large.mp4',
      videoTitle: 'Professional T9 Vintage Dragon Trimmer Studio Showcase',
      category: 'Personal Care & Grooming',
      categoryHint: 'Personal Care & Grooming',
      highlights: [
        'Solid Metal Dragon Carved Body',
        '1200mAh USB Rechargeable Battery',
        '4 Limit Combs Included',
      ],
      urduPitch: '100% اصلی میٹل باڈی ٹریمر، زیرو گیپ بلیڈ اور 7 دن کی ریپلیسمنٹ وارنٹی کے ساتھ دستیاب ہے۔ کیش آن ڈیلیوری پورے پاکستان میں۔',
    };
  }

  if (lower.includes('earbud') || lower.includes('airpod') || lower.includes('headphone') || lower.includes('bluetooth') || lower.includes('audio')) {
    return {
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      extraImages: [
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-wireless-earbuds-42475-large.mp4',
      videoTitle: 'M10 Pro Wireless Gaming Earbuds HD Sound & Powerbank',
      category: 'Consumer Electronics',
      categoryHint: 'Consumer Electronics',
      highlights: [
        'LED Digital Battery Display Case',
        'Emergency Powerbank Mobile Charging',
        'IPX7 Sweat & Water Resistant',
      ],
      urduPitch: 'ڈیپ باس ساؤنڈ اور ایمرجنسی موبائل چارجر پاور بینک کے ساتھ M10 ایئربڈز۔ بہترین کوالٹی اور فاسٹ ڈسپیچ۔',
    };
  }

  if (lower.includes('watch') || lower.includes('smartwatch') || lower.includes('ultra')) {
    return {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      extraImages: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-smartwatch-on-a-stand-42472-large.mp4',
      videoTitle: 'Ultra 8 Pro Bluetooth Calling Smartwatch with OLED Display',
      category: 'Consumer Electronics',
      categoryHint: 'Consumer Electronics',
      highlights: [
        'Full HD 2.08" Bezel-less Display',
        'Direct Bluetooth Calling & Notifications',
        'Rugged Titanium Alloy Watch Casing',
      ],
      urduPitch: 'بلوٹوتھ کالنگ اور ہیلتھ ٹریکنگ والی الٹرا 8 سمارٹ واچ۔ اورینج الپائن لوپ کے ساتھ۔',
    };
  }

  if (lower.includes('blender') || lower.includes('juicer') || lower.includes('kitchen') || lower.includes('chopper') || lower.includes('knife')) {
    return {
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800',
      extraImages: [
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-food-processor-in-action-chopping-vegetables-42480-large.mp4',
      videoTitle: 'Heavy Duty 2L Stainless Steel Kitchen Meat & Vegetable Chopper',
      category: 'Home & Kitchen Essentials',
      categoryHint: 'Home & Kitchen Essentials',
      highlights: [
        'Unbreakable 304 Stainless Steel 2L Bowl',
        '4 Bi-Level Ultra Sharp Steel Blades',
        '300W Pure Copper High-Speed Motor',
      ],
      urduPitch: 'گوشت اور سبزی صرف 6 سیکنڈ میں باریک کریں۔ 304 سٹین لیس سٹیل باؤل اور 2 سپیڈ کاپر موٹر۔',
    };
  }

  // Default fallback
  return {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    extraImages: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-modern-gadget-box-42470-large.mp4',
    videoTitle: `${productName || 'Wholesale Product'} Commercial High-Speed Demo`,
    category: 'General Wholesale',
    categoryHint: 'General Wholesale',
    highlights: [
      'Commercial Grade Wholesale Quality',
      'Tested & Certified with 7-Day Warranty',
      'Fast 2-3 Days Nationwide COD',
    ],
    urduPitch: 'پاکستان بھر میں سب سے زیادہ فروخت ہونے والی پریمیم کوالٹی پراڈکٹ۔ کیش آن ڈیلیوری دستیاب ہے۔',
  };
}
