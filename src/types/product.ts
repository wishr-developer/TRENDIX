/**
 * 商品データの型定義
 */
export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  affiliateUrl: string;
  imageUrl: string;
  brand?: string; // ブランド名（オプショナル）
  category?: string; // カテゴリ（オプショナル、後方互換性のため）
  asin?: string; // ASIN（Amazon商品識別子、オプショナル）
  isSponsored?: boolean; // スポンサー広告かどうか（オプショナル、デフォルトはfalse）
}

