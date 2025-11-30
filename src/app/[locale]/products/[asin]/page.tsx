import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, TrendingDown, TrendingUp, Minus, Trophy } from 'lucide-react';
import { Product } from '@/types/product';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

// rechartsはクライアントコンポーネントとして動的インポート
const PriceChart = dynamic(() => import('@/components/PriceChart'), { ssr: false });

/**
 * URLからASINを抽出
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

/**
 * 商品データを取得（サーバーサイド）
 */
async function getProduct(asin: string): Promise<Product | null> {
  try {
    // サーバーサイドでは直接ファイルを読み込む
    const fs = await import('fs');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), "data", "products.json");
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const products: Product[] = JSON.parse(fileContents);

    // ASINで商品を検索
    const product = products.find((p) => {
      // まず、product.asinフィールドを確認
      if (p.asin && p.asin === asin) {
        return true;
      }
      // 次に、affiliateUrlからASINを抽出して比較
      const urlASIN = extractASIN(p.affiliateUrl);
      if (urlASIN && urlASIN === asin) {
        return true;
      }
      return false;
    });
    
    // デバッグ用ログ（開発環境のみ）
    if (process.env.NODE_ENV === 'development' && !product) {
      console.log('商品が見つかりませんでした:', {
        searchedASIN: asin,
        totalProducts: products.length,
        sampleASINs: products.slice(0, 3).map(p => ({
          asin: p.asin,
          urlASIN: extractASIN(p.affiliateUrl),
          url: p.affiliateUrl,
        })),
      });
    }

    return product || null;
  } catch (error) {
    console.error('商品データの取得に失敗しました:', error);
    return null;
  }
}

/**
 * 動的メタデータを生成
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string; asin: string }> }): Promise<Metadata> {
  const { asin } = await params;
  const product = await getProduct(asin);

  if (!product) {
    return {
      title: '商品が見つかりません | TRENDIX',
    };
  }

  return {
    title: `${product.name} の価格推移と分析 | TRENDIX`,
    description: `${product.name}の現在価格は¥${product.currentPrice.toLocaleString()}。過去の価格推移をグラフで確認し、最安値情報をチェックできます。`,
    openGraph: {
      title: `${product.name} の価格推移と分析 | TRENDIX`,
      description: `現在価格: ¥${product.currentPrice.toLocaleString()}`,
      images: [product.imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} の価格推移と分析 | TRENDIX`,
      description: `現在価格: ¥${product.currentPrice.toLocaleString()}`,
      images: [product.imageUrl],
    },
  };
}

/**
 * 商品詳細ページ
 */
export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; asin: string }> }) {
  const { locale, asin } = await params;
  const product = await getProduct(asin);

  if (!product) {
    notFound();
  }

  const history = product.priceHistory || [];
  const latestPrice = product.currentPrice;
  const prevPrice = history.length > 1 ? history[history.length - 2].price : latestPrice;
  const priceDiff = latestPrice - prevPrice;
  const priceDiffPercent = prevPrice > 0 ? ((priceDiff / prevPrice) * 100).toFixed(1) : '0';

  // 過去最安値を計算
  const lowestPrice = history.length > 0 
    ? Math.min(...history.map(h => h.price), latestPrice)
    : latestPrice;
  const isLowestPrice = latestPrice === lowestPrice;

  // 価格履歴データをグラフ用にフォーマット
  const chartData = history.map((h, index) => ({
    date: new Date(h.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    price: h.price,
    index,
  }));

  // 価格履歴テーブル用データ
  const tableData = [...history].reverse().slice(0, 20); // 最新20件

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>商品一覧に戻る</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 商品情報セクション */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* 商品画像 */}
              <div className="flex-shrink-0">
                <div className="w-full md:w-96 h-96 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={384}
                    height={384}
                    className="object-contain mix-blend-multiply p-4"
                    priority
                  />
                </div>
              </div>

              {/* 商品情報 */}
              <div className="flex-1">
                {/* カテゴリバッジ */}
                {product.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* 商品名 */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* 価格情報 */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ¥{latestPrice.toLocaleString()}
                    </span>
                    {priceDiff < 0 && (
                      <span className="text-lg text-red-600 font-semibold">
                        <TrendingDown size={20} className="inline mr-1" />
                        {priceDiffPercent}%
                      </span>
                    )}
                    {priceDiff > 0 && (
                      <span className="text-lg text-blue-600 font-semibold">
                        <TrendingUp size={20} className="inline mr-1" />
                        +{priceDiffPercent}%
                      </span>
                    )}
                    {priceDiff === 0 && (
                      <span className="text-lg text-gray-500">
                        <Minus size={20} className="inline mr-1" />
                        変動なし
                      </span>
                    )}
                  </div>

                  {/* 過去最安値情報 */}
                  <div className="flex items-center gap-2 mt-2">
                    {isLowestPrice ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        <Trophy size={16} />
                        過去最安値
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">
                        過去最安値: ¥{lowestPrice.toLocaleString()}
                        <span className="ml-2 text-gray-500">
                          (差額: +¥{(latestPrice - lowestPrice).toLocaleString()})
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Amazonで購入するボタン */}
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Amazonで購入する</span>
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* 価格推移グラフセクション */}
          {history.length > 0 && (
            <div className="p-6 md:p-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">価格推移グラフ</h2>
              <PriceChart data={chartData} priceDiff={priceDiff} />
            </div>
          )}

          {/* 価格履歴テーブルセクション */}
          {tableData.length > 0 && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">価格履歴（最新20件）</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">日付</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">価格</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">変動額</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">変動率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => {
                      const prevItem = index < tableData.length - 1 ? tableData[index + 1] : null;
                      const diff = prevItem ? item.price - prevItem.price : 0;
                      const diffPercent = prevItem && prevItem.price > 0 
                        ? ((diff / prevItem.price) * 100).toFixed(1) 
                        : '0';
                      const isLowest = item.price === lowestPrice;

                      return (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            isLowest ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(item.date).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            ¥{item.price.toLocaleString()}
                            {isLowest && (
                              <Trophy size={14} className="inline ml-1 text-yellow-600" />
                            )}
                          </td>
                          <td className={`px-4 py-3 text-right text-sm font-medium ${
                            diff < 0 ? 'text-red-600' : diff > 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {diff !== 0 && (
                              <>
                                {diff < 0 ? '↓' : '↑'}
                                ¥{Math.abs(diff).toLocaleString()}
                              </>
                            )}
                            {diff === 0 && '-'}
                          </td>
                          <td className={`px-4 py-3 text-right text-sm font-medium ${
                            diff < 0 ? 'text-red-600' : diff > 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {diff !== 0 && (
                              <>
                                {diff < 0 ? '-' : '+'}
                                {diffPercent}%
                              </>
                            )}
                            {diff === 0 && '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

