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

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary-600">Price Watcher</h1>
          <p className="text-gray-600 mt-2">Amazon商品の価格変動を監視</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}

