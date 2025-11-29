"use client";

import { Product } from "@/types/product";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ProductCardProps {
  product: Product;
  priceChange: number;
  priceChangePercentage: number;
}

/**
 * 商品カードコンポーネント
 */
export function ProductCard({ product, priceChange, priceChangePercentage }: ProductCardProps) {
  // グラフ用データを準備（最新10件）
  const chartData = product.priceHistory
    .slice(-10)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      }),
      price: entry.price,
    }));

  // 価格をフォーマット
  const formatPrice = (price: number): string => {
    return `¥${price.toLocaleString()}`;
  };

  // 価格変動の表示用
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;
  const changeText = isPositive
    ? `+${formatPrice(priceChange)}`
    : isNegative
    ? formatPrice(priceChange)
    : "変動なし";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
      {/* 商品画像 */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 商品情報 */}
      <div className="p-6">
        {/* 商品名 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {product.name}
        </h2>

        {/* 現在価格と前日比 */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(product.currentPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">前回比:</span>
            <span
              className={`text-sm font-medium ${
                isPositive
                  ? "text-red-600"
                  : isNegative
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {changeText}
              {priceChangePercentage !== 0 && (
                <span className="ml-1">
                  ({isPositive ? "+" : ""}
                  {priceChangePercentage.toFixed(2)}%)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* 価格推移グラフ */}
        <div className="mb-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={60}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatPrice(value)}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Amazonで見るボタン */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Amazonで見る
        </a>
      </div>
    </div>
  );
}

