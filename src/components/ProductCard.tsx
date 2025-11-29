"use client";

import { ExternalLink, ArrowDownRight, Minus } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const history = product.priceHistory || [];
  const latest = product.currentPrice;
  const prev = history.length > 1 ? history[history.length - 2].price : latest;
  const diff = latest - prev;
  const isCheaper = diff < 0;
  
  // 割引率の計算（ダミーではなく実データに基づく）
  const percent = prev > 0 ? Math.round((Math.abs(diff) / prev) * 100) : 0;

  return (
    <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" 
       className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-soft border border-transparent hover:border-gray-100 flex flex-col h-full relative overflow-hidden">
      
      {/* 割引バッジ（安くなっている時だけ表示） */}
      {isCheaper && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
          {percent}% OFF
        </div>
      )}

      {/* 画像エリア */}
      <div className="aspect-square w-full mb-4 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-4" loading="lazy" />
      </div>

      {/* 情報エリア */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">¥{latest.toLocaleString()}</span>
            {isCheaper && (
              <span className="text-xs text-gray-400 line-through">¥{prev.toLocaleString()}</span>
            )}
          </div>
          
          {/* 価格変動ステータス */}
          <div className="flex items-center gap-1 mt-1">
            {isCheaper ? (
              <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight size={12} className="mr-0.5" /> 
                ¥{Math.abs(diff).toLocaleString()} 値下がり
              </span>
            ) : (
              <span className="flex items-center text-xs text-gray-400">
                <Minus size={12} className="mr-1" /> 変動なし
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
