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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Product[] | { error: string }) => {
        // エラーレスポンスのチェック
        if (Array.isArray(data)) {
          setInitialProducts(data);
          setIsLoading(false);
        } else if (data && typeof data === 'object' && 'error' in data) {
          // APIがエラーを返した場合
          console.error('APIエラー:', data.error);
          setInitialProducts([]);
          setIsLoading(false);
        } else {
          // 予期しない形式のレスポンス
          console.error('予期しないレスポンス形式:', data);
          setInitialProducts([]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('商品データの取得に失敗しました:', error);
        setInitialProducts([]);
        setIsLoading(false);
      });
  }, []);

  // ローディング状態とデータを渡す
  return <HomeClient initialProducts={initialProducts} isLoading={isLoading} />;
}
