'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import AlertModal from '@/components/AlertModal';
import { Product } from '@/types/product';
import { Crown } from 'lucide-react';

/**
 * Deal Scoreを計算する関数
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
 * URLからASINを抽出（重複防止用）
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

type TabType = 'drops' | 'new' | 'ranking' | 'all';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  useEffect(() => { 
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts); 
  }, []);

  // 重複防止（ASINベースでフィルタリング）
  const uniqueProducts = useMemo(() => {
    const seenASINs = new Set<string>();
    const unique: Product[] = [];
    
    for (const product of products) {
      const asin = extractASIN(product.affiliateUrl);
      if (asin && !seenASINs.has(asin)) {
        seenASINs.add(asin);
        unique.push(product);
      } else if (!asin) {
        // ASINが抽出できない場合はidベースで重複チェック
        if (!unique.find(p => p.id === product.id)) {
          unique.push(product);
        }
      }
    }
    
    return unique;
  }, [products]);

  // 統計情報を計算
  const stats = useMemo(() => {
    const totalProducts = uniqueProducts.length;
    
    // 本日値下がり件数
    const dropsToday = uniqueProducts.filter((p) => {
      const history = p.priceHistory || [];
      if (history.length < 2) return false;
      const latest = p.currentPrice;
      const prev = history[history.length - 2].price;
      return latest < prev;
    }).length;
    
    // 最安値更新件数（現在価格が過去最安値と同じ）
    const lowestPriceUpdates = uniqueProducts.filter((p) => {
      const history = p.priceHistory || [];
      if (history.length === 0) return false;
      const prices = history.map(h => h.price);
      const lowest = Math.min(...prices, p.currentPrice);
      return p.currentPrice === lowest && history.length >= 2;
    }).length;
    
    return {
      totalProducts,
      dropsToday,
      lowestPriceUpdates,
    };
  }, [uniqueProducts]);

  // タブに応じたフィルタリング
  const filteredProducts = useMemo(() => {
    let result = [...uniqueProducts];

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p: Product) => {
        const name = p.name.toLowerCase();
        const isMatch = name.includes(query);
        if (!isMatch) return false;

        if (query === 'apple' || query === 'アップル') {
          if (name.includes('香り') || name.includes('トリートメント') || name.includes('ヘア') || name.includes('ボディ') || name.includes('シャンプー')) {
            return false;
          }
        }

        return true;
      });
    }

    // タブフィルター
    switch (activeTab) {
      case 'drops':
        // 値下がり速報
        result = result.filter((p: Product) => {
          const history = p.priceHistory || [];
          if (history.length < 2) return false;
          const latest = p.currentPrice;
          const prev = history[history.length - 2].price;
          return latest < prev;
        });
        // 値下がり率が高い順にソート
        result.sort((a, b) => {
          const historyA = a.priceHistory || [];
          const historyB = b.priceHistory || [];
          if (historyA.length < 2 || historyB.length < 2) return 0;
          const diffA = a.currentPrice - historyA[historyA.length - 2].price;
          const diffB = b.currentPrice - historyB[historyB.length - 2].price;
          return diffA - diffB; // より値下がりしている順
        });
        break;
      
      case 'new':
        // 新着（登録が新しい順）
        result.sort((a, b) => {
          const dateA = a.priceHistory && a.priceHistory.length > 0 
            ? new Date(a.priceHistory[a.priceHistory.length - 1].date).getTime() 
            : 0;
          const dateB = b.priceHistory && b.priceHistory.length > 0 
            ? new Date(b.priceHistory[b.priceHistory.length - 1].date).getTime() 
            : 0;
          return dateB - dateA;
        });
        break;
      
      case 'ranking':
        // ランキング（Deal Score順）
        result.sort((a, b) => {
          const scoreA = calculateDealScore(a);
          const scoreB = calculateDealScore(b);
          return scoreB - scoreA;
        });
        break;
      
      case 'all':
      default:
        // すべて（新着順）
        result.sort((a, b) => {
          const dateA = a.priceHistory && a.priceHistory.length > 0 
            ? new Date(a.priceHistory[a.priceHistory.length - 1].date).getTime() 
            : 0;
          const dateB = b.priceHistory && b.priceHistory.length > 0 
            ? new Date(b.priceHistory[b.priceHistory.length - 1].date).getTime() 
            : 0;
          return dateB - dateA;
        });
        break;
    }

    // 最終確認：ASINベースで重複排除（1商品 = 1カードを保証）
    const finalResult: Product[] = [];
    const seenASINs = new Set<string>();
    
    for (const product of result) {
      const asin = extractASIN(product.affiliateUrl);
      const identifier = asin || product.id;
      
      if (!seenASINs.has(identifier)) {
        seenASINs.add(identifier);
        finalResult.push(product);
      }
    }

    return finalResult;
  }, [uniqueProducts, searchQuery, activeTab]);

  // トレンドTOP3（スコア順）
  const trendProducts = useMemo(() => {
    const sorted = [...uniqueProducts].sort((a, b) => {
      const scoreA = calculateDealScore(a);
      const scoreB = calculateDealScore(b);
      return scoreB - scoreA;
    });
    return sorted.filter(p => calculateDealScore(p) > 0).slice(0, 3);
  }, [uniqueProducts]);

  const tabs: Array<{ id: TabType; label: string; emoji: string }> = [
    { id: 'drops', label: '値下がり速報', emoji: '🔥' },
    { id: 'new', label: '新着', emoji: '✨' },
    { id: 'ranking', label: 'ランキング', emoji: '👑' },
    { id: 'all', label: 'すべて', emoji: '' },
  ];

  const handleAlertClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header onSearch={setSearchQuery} />
      <AlertModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={selectedProduct} 
      />
      <div className="pb-20 bg-[#f8f9fa] min-h-screen">
        {/* 統計サマリーエリア（ヘッダー直下） */}
        <section className="bg-white border-b border-gray-200 py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* メインメッセージ */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                買い時の商品が、<span className="text-blue-600">一瞬でわかる。</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base mb-2">
                Amazonの価格変動を24時間365日監視中
              </p>
              <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto">
                XIORA TRENDは、Amazonの価格変動をAIで継続監視し、本当に安くなった商品のみを自動で抽出・表示します。
              </p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 監視商品数 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-sm text-blue-700 font-medium mb-2">監視商品数</div>
                <div className="text-4xl font-bold text-blue-900">{stats.totalProducts}</div>
                <div className="text-xs text-blue-600 mt-1">商品をリアルタイム監視中</div>
              </div>

              {/* 本日値下がり件数 */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="text-sm text-red-700 font-medium mb-2">本日値下がり件数</div>
                <div className="text-4xl font-bold text-red-900">{stats.dropsToday}</div>
                <div className="text-xs text-red-600 mt-1">件の商品が値下がり</div>
              </div>

              {/* 最安値更新件数 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="text-sm text-yellow-700 font-medium mb-2">最安値更新件数</div>
                <div className="text-4xl font-bold text-yellow-900">{stats.lowestPriceUpdates}</div>
                <div className="text-xs text-yellow-600 mt-1">件が過去最安値を更新</div>
              </div>
            </div>
          </div>
        </section>

        {/* 本日のトレンド（TOP3カルーセル） */}
        {trendProducts.length > 0 && !searchQuery && (
          <section className="bg-white border-b border-gray-200 py-6 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-slate-900">本日のトレンド</h2>
              </div>
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 pb-2">
                    {trendProducts.map((product, index) => (
                      <a
                        key={product.id}
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Crown size={14} className="text-yellow-500" />
                          <span className="text-xs font-bold text-purple-600">No.{index + 1}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                          {product.name}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ¥{product.currentPrice.toLocaleString()}
                          </span>
                          {product.priceHistory.length >= 2 && (
                            <span className="text-xs text-gray-400 line-through">
                              ¥{product.priceHistory[product.priceHistory.length - 2].price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-red-600 font-semibold mt-1">
                          AI Deal Score: {calculateDealScore(product)}/100
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* タブ切り替えUI */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.emoji && <span className="mr-1">{tab.emoji}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 商品グリッド */}
        <div className="container mx-auto max-w-7xl px-4 py-6">
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                「{searchQuery}」の検索結果
              </h2>
              <span className="text-sm text-gray-500">
                {filteredProducts.length}件 / 全{uniqueProducts.length}件
              </span>
            </div>
          )}
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">商品が見つかりませんでした</p>
              <p className="text-gray-400 text-sm">検索条件を変更してお試しください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAlertClick={handleAlertClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
