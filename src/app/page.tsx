"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useCategory } from "@/contexts/CategoryContext";
import { Product } from "@/types/product";

/**
 * カテゴリを推測する（商品名から）
 */
function guessCategory(product: Product): string | null {
  const name = product.name.toLowerCase();
  if (
    name.includes("pc") ||
    name.includes("パソコン") ||
    name.includes("macbook") ||
    name.includes("ipad") ||
    name.includes("タブレット")
  ) {
    return "computers";
  }
  if (
    name.includes("家電") ||
    name.includes("イヤホン") ||
    name.includes("ヘッドホン") ||
    name.includes("充電") ||
    name.includes("ケーブル")
  ) {
    return "electronics";
  }
  if (
    name.includes("キッチン") ||
    name.includes("フライパン") ||
    name.includes("鍋") ||
    name.includes("食器")
  ) {
    return "kitchen";
  }
  if (
    name.includes("ゲーム") ||
    name.includes("switch") ||
    name.includes("playstation") ||
    name.includes("nintendo")
  ) {
    return "videogames";
  }
  if (
    name.includes("プロテイン") ||
    name.includes("サプリ") ||
    name.includes("健康") ||
    name.includes("洗剤")
  ) {
    return "hpc";
  }
  if (name.includes("化粧") || name.includes("スキンケア") || name.includes("美容")) {
    return "beauty";
  }
  if (name.includes("食品") || name.includes("飲料") || name.includes("お菓子")) {
    return "food";
  }
  if (name.includes("文房具") || name.includes("ペン") || name.includes("ノート")) {
    return "office";
  }
  return null;
}

/**
 * メインページ（ダッシュボード形式）
 */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { selectedCategory } = useCategory();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // カテゴリフィルタリング
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => guessCategory(product) === selectedCategory);

  // 価格が下がった商品数を計算
  const priceDrops = products.filter((product) => {
    const history = product.priceHistory || [];
    if (history.length < 2) return false;
    const latest = history[history.length - 1].price;
    const prev = history[history.length - 2].price;
    return latest < prev;
  }).length;

  return (
    <>
      <Header />
      <main className="p-6 max-w-[1600px] mx-auto w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-surface border border-border rounded-lg">
            <div className="text-xs text-text-muted mb-1">Total Monitored</div>
            <div className="text-2xl font-bold text-text-main font-mono">{products.length}</div>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <div className="text-xs text-text-muted mb-1">Price Drops (24h)</div>
            <div className="text-2xl font-bold text-green-500 font-mono">{priceDrops}</div>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <div className="text-xs text-text-muted mb-1">System Status</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-text-main">Operational</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-main">All Products</h2>
          <div className="text-xs text-text-dim">Real-time data</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </>
  );
}
