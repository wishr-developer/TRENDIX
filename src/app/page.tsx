"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
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
 * メインページ
 */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // カテゴリフィルタリング
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => guessCategory(product) === category);

  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute inset-0 bg-grid opacity-20"></div>
      </div>
      <Header />

      <div className="container mx-auto max-w-7xl relative z-10 flex">
        <Sidebar selectedCategory={category} onSelectCategory={setCategory} />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {filteredProducts.length} Active Monitors
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
