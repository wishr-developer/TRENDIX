import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, TrendingDown, TrendingUp, Minus, Trophy } from 'lucide-react';
import { Product } from '@/types/product';
import dynamic from 'next/dynamic';
import DealScoreBadge from '@/components/DealScoreBadge';

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
 * Deal Scoreを計算
 */
function calculateDealScore(product: Product): number {
  const history = product.priceHistory || [];
  if (history.length < 2) return 0;

  const latest = product.currentPrice;
  const prev = history[history.length - 2].price;
  const diff = latest - prev;
  
  if (diff >= 0) return 0;
  
  const discountPercent = prev > 0 ? (Math.abs(diff) / prev) * 100 : 0;
  const score = Math.min(discountPercent * 2, 100);
  
  return Math.round(score);
}

/**
 * 過去最安値を取得
 */
function getLowestPrice(product: Product): number | null {
  const history = product.priceHistory || [];
  if (history.length === 0) return null;
  
  const prices = history.map(h => h.price);
  return Math.min(...prices, product.currentPrice);
}

/**
 * 直近N日間で最安値更新したかチェック
 */
function isLowestPriceInRecentDays(product: Product, days: number): boolean {
  const history = product.priceHistory || [];
  if (history.length === 0) return false;
  
  const latest = product.currentPrice;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // 直近N日間の価格履歴を取得
  const recentHistory = history.filter(h => {
    const historyDate = new Date(h.date);
    return historyDate >= cutoffDate;
  });
  
  if (recentHistory.length === 0) return false;
  
  // 直近N日間の最安値を計算
  const recentPrices = recentHistory.map(h => h.price);
  const recentLowest = Math.min(...recentPrices, latest);
  
  // 現在価格が直近N日間の最安値と一致し、かつ過去最安値でもある
  const allTimeLowest = getLowestPrice(product);
  return latest === recentLowest && latest === allTimeLowest;
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
  const lowestPrice = getLowestPrice(product);
  const isLowestPrice = lowestPrice !== null && latestPrice === lowestPrice;
  const diffFromLowest = lowestPrice !== null ? latestPrice - lowestPrice : null;

  // AI Deal Scoreを計算
  const dealScore = calculateDealScore(product);

  // 直近7日で最安値更新したかチェック
  const isLowestPriceRecent = isLowestPriceInRecentDays(product, 7);

  // 価格履歴データをグラフ用にフォーマット
  const chartData = history.map((h, index) => ({
    date: new Date(h.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    price: h.price,
    index,
  }));

  // 価格履歴テーブル用データ（日付順、最新が上）
  const tableData = [...history].reverse().slice(0, 50); // 最新50件

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* 戻るボタン */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-[1920px] px-4 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>商品一覧に戻る</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-[1920px] px-4 py-8">
        {/* サマリーパネル（核心価値の強調） */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border-2 border-blue-100 p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">この価格で買うべき理由</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Deal Score */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm font-semibold text-gray-600 mb-3">AI Deal Score</div>
              {dealScore > 0 ? (
                <div className="flex items-center justify-center">
                  <DealScoreBadge score={dealScore} />
                </div>
              ) : (
                <div className="text-center text-gray-400 text-sm">スコアなし</div>
              )}
            </div>

            {/* 最安値との差 */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm font-semibold text-gray-600 mb-3">最安値との差</div>
              {diffFromLowest !== null ? (
                <div className="text-center">
                  {diffFromLowest === 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy size={24} className="text-yellow-600" />
                      <span className="text-2xl font-bold text-yellow-700">過去最安値</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gray-900">
                        +¥{diffFromLowest.toLocaleString()}
                      </div>
                      {lowestPrice !== null && (
                        <div className="text-sm text-gray-500 mt-1">
                          過去最安値: ¥{lowestPrice.toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 text-sm">データなし</div>
              )}
            </div>

            {/* 過去最安値ステータス */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm font-semibold text-gray-600 mb-3">最安値更新状況</div>
              <div className="text-center">
                {isLowestPriceRecent ? (
                  <div className="flex items-center justify-center gap-2">
                    <Trophy size={24} className="text-yellow-600" />
                    <span className="text-xl font-bold text-yellow-700">直近7日で最安値更新</span>
                  </div>
                ) : isLowestPrice ? (
                  <div className="text-lg font-semibold text-gray-700">過去最安値</div>
                ) : (
                  <div className="text-lg font-semibold text-gray-500">過去最安値ではない</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 商品情報カード */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
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
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
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

                  {/* 前回価格 */}
                  {prevPrice !== latestPrice && (
                    <div className="text-sm text-gray-500 line-through mb-2">
                      前回価格: ¥{prevPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Amazonで購入するボタン */}
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-cta hover:bg-red-600 text-white font-bold text-lg rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Amazonで購入する</span>
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* 価格推移グラフセクション（全幅） */}
          {history.length > 0 && (
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 mb-6">価格推移グラフ</h2>
              <div className="w-full">
                <PriceChart data={chartData} priceDiff={priceDiff} />
              </div>
            </div>
          )}

          {/* 価格履歴テーブルセクション */}
          {tableData.length > 0 && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">価格履歴（最新50件）</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
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
                      const isLowest = lowestPrice !== null && item.price === lowestPrice;

                      return (
                        <tr
                          key={`${item.date}-${index}`}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
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
                            <div className="flex items-center justify-end gap-1">
                              ¥{item.price.toLocaleString()}
                              {isLowest && (
                                <Trophy size={14} className="text-yellow-600" />
                              )}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-right text-sm font-medium ${
                            diff < 0 ? 'text-red-600' : diff > 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {diff !== 0 ? (
                              <div className="flex items-center justify-end gap-1">
                                {diff < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                <span>¥{Math.abs(diff).toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 text-right text-sm font-medium ${
                            diff < 0 ? 'text-red-600' : diff > 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {diff !== 0 ? (
                              <span>
                                {diff < 0 ? '-' : '+'}
                                {diffPercent}%
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
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
