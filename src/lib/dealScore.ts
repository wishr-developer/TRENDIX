import { Product } from '@/types/product';

/**
 * Deal Scoreを計算する関数
 * - 直近価格からの値下がり率をベースに0〜100点でスコアリング
 */
export function calculateDealScore(product: Product): number {
  const history = product.priceHistory || [];
  if (history.length < 2) return 0;

  const latest = product.currentPrice;
  const prev = history[history.length - 2].price;
  const diff = latest - prev;

  if (diff >= 0) return 0;

  const discountPercent = prev > 0 ? (Math.abs(diff) / prev) * 100 : 0;
  const score = Math.min(discountPercent * 2, 100);

  return Math.round(score);
}
