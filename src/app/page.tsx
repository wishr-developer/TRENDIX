import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import fs from "fs";
import path from "path";

/**
 * 商品データを読み込む
 */
async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

/**
 * 最終更新日を取得する（products.jsonの最新の価格履歴から）
 */
function getLastUpdateDate(products: Product[]): string {
  let latestDate: Date | null = null;

  for (const product of products) {
    if (product.priceHistory && product.priceHistory.length > 0) {
      const lastEntry = product.priceHistory[product.priceHistory.length - 1];
      const entryDate = new Date(lastEntry.date);
      if (!latestDate || entryDate > latestDate) {
        latestDate = entryDate;
      }
    }
  }

  if (latestDate) {
    return latestDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 前日比を計算する
 */
function calculatePriceChange(currentPrice: number, priceHistory: Array<{ date: string; price: number }>): {
  change: number;
  percentage: number;
} {
  if (priceHistory.length < 2) {
    return { change: 0, percentage: 0 };
  }

  // 最新の価格とその前の価格を比較
  const latestPrice = priceHistory[priceHistory.length - 1]?.price || currentPrice;
  const previousPrice = priceHistory[priceHistory.length - 2]?.price || currentPrice;

  const change = latestPrice - previousPrice;
  const percentage = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

  return { change, percentage };
}

/**
 * メインページ
 */
export default async function Home() {
  const products = await getProducts();
  const lastUpdateDate = getLastUpdateDate(products);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Price Watcher
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Amazon商品の価格変動を監視・比較
              </p>
            </div>
            {/* 最終更新日バッジ */}
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
              <span className="text-primary-600 text-lg">🕒</span>
              <div>
                <span className="text-xs text-primary-700 font-medium block">
                  最終更新
                </span>
                <span className="text-sm text-primary-900 font-semibold">
                  {lastUpdateDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">商品が登録されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const { change, percentage } = calculatePriceChange(
                product.currentPrice,
                product.priceHistory
              );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  priceChange={change}
                  priceChangePercentage={percentage}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

