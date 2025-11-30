'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

/**
 * URLからASINを抽出
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

interface FavoritesListProps {
  allProducts: Product[];
  onAlertClick?: (product: Product) => void;
  searchQuery?: string;
}

/**
 * お気に入り一覧コンポーネント
 */
export default function FavoritesList({ allProducts, onAlertClick, searchQuery = '' }: FavoritesListProps) {
  const [favoriteASINs, setFavoriteASINs] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const router = useRouter();

  // お気に入りASINのリストを取得・更新
  const updateFavorites = useCallback(() => {
    if (typeof window === 'undefined') return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteASINs(favorites);

    // ASINに基づいて商品をフィルタリング
    let filtered = allProducts.filter((product) => {
      const asin = product.asin || extractASIN(product.affiliateUrl);
      return asin && favorites.includes(asin);
    });

    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const name = product.name.toLowerCase();
        return name.includes(query);
      });
    }

    setFavoriteProducts(filtered);
  }, [allProducts, searchQuery]);

  // 初回読み込み時とlocalStorage変更時に更新
  useEffect(() => {
    updateFavorites();

    // storageイベント（他のタブでの変更を検知）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        updateFavorites();
      }
    };

    // favoriteUpdatedイベント（同一タブ内での変更を検知）
    const handleFavoriteUpdated = () => {
      updateFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoriteUpdated', handleFavoriteUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdated);
    };
  }, [updateFavorites]);

  // お気に入り削除時のコールバック
  const handleFavoriteToggle = (asin: string, isFavorite: boolean) => {
    // お気に入りが削除された場合、リストからも削除
    if (!isFavorite) {
      updateFavorites();
    }
  };

  // 空の状態
  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {searchQuery ? '検索結果が見つかりませんでした' : 'お気に入りがありません'}
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {searchQuery 
              ? `「${searchQuery}」に一致するお気に入り商品が見つかりませんでした。`
              : 'お気に入りがありません。人気のトレンド商品から見つけてみましょう！'
            }
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <span>トレンド商品を見る</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            お気に入り商品
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {favoriteProducts.length}件
          </span>
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAlertClick={onAlertClick}
            onFavoriteToggle={handleFavoriteToggle}
            isPriority={false}
          />
        ))}
      </div>
    </div>
  );
}

