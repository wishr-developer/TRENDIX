import { Metadata } from 'next';
import FavoritesList from '@/components/FavoritesList';
import { Product } from '@/types/product';
import fs from 'fs';
import path from 'path';

/**
 * メタデータを生成
 */
export const metadata: Metadata = {
  title: 'お気に入り商品一覧 | TRENDIX',
  description: 'お気に入りに登録した商品を一覧で確認できます。価格変動を監視し、買い時を見逃しません。',
  openGraph: {
    title: 'お気に入り商品一覧 | TRENDIX',
    description: 'お気に入りに登録した商品を一覧で確認できます。',
  },
  twitter: {
    card: 'summary',
    title: 'お気に入り商品一覧 | TRENDIX',
    description: 'お気に入りに登録した商品を一覧で確認できます。',
  },
};

/**
 * 商品データを取得（サーバーサイド）
 */
async function getAllProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const products: Product[] = JSON.parse(fileContents);

    return products;
  } catch (error) {
    console.error('商品データの取得に失敗しました:', error);
    return [];
  }
}

/**
 * お気に入り一覧ページ
 */
export default async function FavoritesPage() {
  const allProducts = await getAllProducts();

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FavoritesList allProducts={allProducts} />
      </div>
    </div>
  );
}

