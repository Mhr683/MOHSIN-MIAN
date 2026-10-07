import { getSmartProductAssets } from './productAssetMatcher';

export interface ParsedCsvProduct {
  name: string;
  sku: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  weight: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  description?: string;
  brand?: string;
}

export interface CsvParseResult {
  products: ParsedCsvProduct[];
  errors: string[];
}

export function parseCsvText(rawContent: string, supplierName: string = 'Verified Wholesale Hub'): CsvParseResult {
  const lines = rawContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { products: [], errors: ['Empty CSV content'] };
  }

  const products: ParsedCsvProduct[] = [];
  const errors: string[] = [];

  // Check header line
  let startIndex = 0;
  const headerLine = lines[0].toLowerCase();
  if (headerLine.includes('name') || headerLine.includes('title') || headerLine.includes('product') || headerLine.includes('sku') || headerLine.includes('cost')) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma or semicolon, handling simple quoted strings
    const cols = line.split(/[,;\t]/).map((col) => col.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 2) continue;

    const name = cols[0] || `Wholesale Item #${i}`;
    const sku = cols[1]?.startsWith('SKU') ? cols[1] : `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = cols[2] && isNaN(Number(cols[2])) ? cols[2] : 'Consumer Electronics';
    
    // Find numeric cost and price
    const cost = Math.max(100, Number(cols[3]) || Number(cols[2]) || 1200);
    const price = Math.max(cost + 200, Number(cols[4]) || Math.round(cost * 1.8));
    const stock = Math.max(1, Number(cols[5]) || 50);
    const weight = Math.max(0.2, Number(cols[6]) || 0.5);

    const assetPack = getSmartProductAssets(name);
    const image = cols[7]?.startsWith('http') ? cols[7] : assetPack.image;

    products.push({
      name,
      sku,
      category,
      cost,
      price,
      stock,
      weight,
      image,
      images: [image, ...assetPack.extraImages],
      videoUrl: assetPack.videoUrl,
      description: `High-demand trending product imported from ${supplierName}. 100% Original and tested.`,
      brand: 'Wholesale Certified',
    });
  }

  return { products, errors };
}
