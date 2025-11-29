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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 card-hover">
      {/* 商品画像 */}
      <div className="w-full h-52 bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* 商品情報 */}
      <div className="p-7">
        {/* 商品名 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 leading-snug">
          {product.name}
        </h2>

        {/* 現在価格と前日比 */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.currentPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">前回比:</span>
            <span
              className={`text-sm font-semibold ${
                isPositive
                  ? "text-red-600"
                  : isNegative
                  ? "text-primary-600"
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
        <div className="mb-5 h-36 bg-gray-50 rounded-lg p-2">
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
          className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Amazonで見る
        </a>
      </div>
    </div>
  );
}

