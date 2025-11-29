"use client";

import { Product } from "@/types/product";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ProductCardProps {
  product: Product;
}

/**
 * 商品カードコンポーネント（分析ウィジェット風 - Cyberpunk UI）
 */
export default function ProductCard({ product }: ProductCardProps) {
  const history = product.priceHistory || [];
  const latest = product.currentPrice;
  const prev = history.length > 1 ? history[history.length - 2].price : latest;
  let status: "drop" | "rise" | "stable" = latest < prev ? "drop" : latest > prev ? "rise" : "stable";

  const badges = {
    drop: {
      text: "BUY NOW",
      color: "text-primary",
      border: "border-primary/30",
      bg: "bg-primary/10",
    },
    rise: {
      text: "WAIT",
      color: "text-red-400",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
    },
    stable: {
      text: "STABLE",
      color: "text-gray-400",
      border: "border-gray-500/30",
      bg: "bg-gray-500/10",
    },
  };
  const badge = badges[status];
  const chartData =
    history.length > 0
      ? history.map((h) => ({ p: h.price }))
      : Array(10)
          .fill(0)
          .map(() => ({ p: latest }));

  return (
    <div className="group relative bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-neon-cyan hover:-translate-y-1">
      <div className="p-4 flex gap-4">
        <div className="w-20 h-20 bg-white/5 rounded-xl p-2 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-full opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="flex-1">
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border mb-2 ${badge.bg} ${badge.color} ${badge.border}`}
          >
            {status === "drop" ? (
              <svg width={10} height={10} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            ) : status === "rise" ? (
              <svg width={10} height={10} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            ) : (
              <svg width={10} height={10} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )}
            {badge.text}
          </div>
          <h3 className="text-sm text-gray-200 line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold text-white">¥{product.currentPrice.toLocaleString()}</span>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-primary hover:text-black transition-colors"
            >
              <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="h-12 w-full border-t border-white/5 bg-black/20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="p"
              stroke={status === "drop" ? "#00f3ff" : "#94a3b8"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
