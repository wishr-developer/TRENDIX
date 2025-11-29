"use client";

import { Product } from "@/types/product";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ProductCardProps {
  product: Product;
}

/**
 * 商品カードコンポーネント（データパネル風 - プロフェッショナルなSaaS管理画面）
 */
export default function ProductCard({ product }: ProductCardProps) {
  const history = product.priceHistory || [];
  const latest = product.currentPrice;
  const prev = history.length > 1 ? history[history.length - 2].price : latest;
  const diff = latest - prev;
  const percent = prev > 0 ? ((diff / prev) * 100).toFixed(1) : "0.0";

  // ステータス判定
  let status: "drop" | "rise" | "stable" = "stable";
  if (diff < 0) status = "drop";
  if (diff > 0) status = "rise";

  const chartColor =
    status === "drop" ? "#10b981" : status === "rise" ? "#ef4444" : "#52525b"; // 緑=安くなった(良), 赤=高くなった(悪)
  const chartData =
    history.length > 0
      ? history.map((h) => ({ p: h.price }))
      : Array(10)
          .fill(0)
          .map(() => ({ p: latest }));

  return (
    <div className="group bg-surface border border-border rounded-lg p-4 hover:border-text-dim transition-colors flex flex-col h-full">
      <div className="flex gap-4 mb-3">
        <div className="w-12 h-12 bg-white rounded-md p-1 flex-shrink-0 border border-border overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-text-main leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="text-xs text-text-dim font-mono">
            {product.id ? `ID: ${product.id}` : "ASIN: ---"}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-lg font-bold text-text-main font-mono tracking-tight">
              ¥{latest.toLocaleString()}
            </div>
            {status !== "stable" && (
              <div
                className={`text-xs font-medium flex items-center gap-1 ${
                  status === "drop" ? "text-green-500" : "text-red-500"
                }`}
              >
                {status === "drop" ? (
                  <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                ) : (
                  <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                )}
                <span>
                  {Math.abs(diff).toLocaleString()} ({Math.abs(Number(percent))}%)
                </span>
              </div>
            )}
            {status === "stable" && (
              <div className="text-xs text-text-dim flex items-center gap-1">
                <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                No change
              </div>
            )}
          </div>
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="p"
                  stroke={chartColor}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-8 rounded border border-border bg-transparent text-xs font-medium text-text-muted hover:bg-surfaceHighlight hover:text-text-main transition-colors"
        >
          View on Amazon
          <svg
            width={12}
            height={12}
            className="ml-1.5 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
  );
}
