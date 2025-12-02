'use client';

import dynamic from 'next/dynamic';
import { Product } from '@/types/product';

type PeriodType = '7D' | '30D' | 'ALL';

interface ProductCardChartProps {
  product: Product;
  selectedPeriod: PeriodType;
}

/**
 * 期間に基づいて価格推移データをフィルタリング
 */
function prepareChartData(product: Product, period: PeriodType): Array<{ price: number }> {
  const history = product.priceHistory || [];

  if (history.length === 0) {
    return [{ price: product.currentPrice }];
  }

  let filteredHistory = [...history];

  if (period === '7D') {
    filteredHistory = history.slice(-7);
  } else if (period === '30D') {
    filteredHistory = history.slice(-30);
  }

  return filteredHistory.map((h) => ({ price: h.price }));
}

/**
 * グラフの色を決定
 */
function getChartColor(product: Product): string {
  const history = product.priceHistory || [];
  if (history.length < 2) return '#9ca3af';

  const latest = product.currentPrice;
  const prev = history[history.length - 2].price;
  const diff = latest - prev;

  if (diff < 0) return '#EF4444';
  if (diff > 0) return '#3B82F6';
  return '#9ca3af';
}

/**
 * グラフコンポーネント（rechartsを動的インポート）
 */
const RechartsChart = dynamic(
  () =>
    import('recharts').then((mod) => {
      const { ResponsiveContainer, LineChart, Line } = mod;
      return function Chart({ data, color }: { data: Array<{ price: number }>; color: string }) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-xs text-gray-400">読み込み中...</div>
      </div>
    ),
  }
);

/**
 * 商品カード内の価格推移グラフコンポーネント
 * rechartsライブラリを動的インポートして初期ロードを最適化
 */
export default function ProductCardChart({ product, selectedPeriod }: ProductCardChartProps) {
  const chartData = prepareChartData(product, selectedPeriod);
  const chartColor = getChartColor(product);

  return <RechartsChart data={chartData} color={chartColor} />;
}

