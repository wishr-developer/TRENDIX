'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => { 
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts); 
  }, []);

  return (
    <div className="pb-20">
      {/* ヒーローセクション（アイキャッチ） */}
      <section className="bg-surface border-b border-border py-16 px-4 mb-10">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            買い時の商品が、<br className="md:hidden" /><span className="text-blue-600">一瞬でわかる。</span>
          </h1>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Amazonの価格変動を24時間365日監視。
            <br />
            今、本当に安くなっている商品だけを厳選して表示します。
          </p>
          <div className="flex justify-center gap-2 text-sm font-medium overflow-x-auto pb-2">
            {['Apple', 'Anker', 'Sony', 'Nintendo', '食品', '日用品'].map(tag => (
              <button key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap shadow-sm">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 商品グリッド */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">注目の値下がり商品</h2>
          <span className="text-sm text-gray-500">{products.length}商品を監視中</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
