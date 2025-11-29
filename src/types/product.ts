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
}

