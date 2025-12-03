'use client';

import HomeClient from './HomeClient';
import { Product } from '@/types/product';
import { useState, useEffect } from 'react';

/**
 * ホームページ（クライアントコンポーネント）
 * API経由で商品データを取得して、HomeClientに渡す
 * これにより、HTMLに全商品データが埋め込まれず、Vercelのサイズ制限を回避
 */
export default function Home() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // API経由で商品データを取得
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setInitialProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('商品データの取得に失敗しました:', error);
        setInitialProducts([]);
        setIsLoading(false);
      });
  }, []);

  // ローディング中は空の配列を渡す（HomeClient内でローディング状態を処理）
  return <HomeClient initialProducts={initialProducts} />;
}
