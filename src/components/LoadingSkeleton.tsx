"use client";

/**
 * 商品カードのローディングスケルトンコンポーネント
 * 商品カードのレイアウトを模したプレースホルダーを表示
 */
export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* モバイル: 横並びレイアウト */}
      <div className="md:hidden flex gap-4 p-4">
        {/* 左: 画像スケルトン */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        </div>

        {/* 右: 情報エリアスケルトン */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* カテゴリタグ */}
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          
          {/* 商品名 */}
          <div className="space-y-1">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* AI Deal Score */}
          <div className="h-3 w-24 bg-gray-200 rounded"></div>

          {/* 価格変動情報 */}
          <div className="h-3 w-20 bg-gray-200 rounded"></div>

          {/* 最安値との差 */}
          <div className="h-3 w-28 bg-gray-200 rounded"></div>

          {/* 期間選択ボタン */}
          <div className="flex gap-1">
            <div className="h-5 w-8 bg-gray-200 rounded"></div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
          </div>

          {/* グラフ */}
          <div className="h-10 w-full bg-gray-200 rounded"></div>

          {/* 価格とボタン */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* PC: 縦長カード型レイアウト */}
      <div className="hidden md:flex flex-col">
        {/* 画像スケルトン */}
        <div className="w-full aspect-square bg-gray-200"></div>

        {/* 情報エリアスケルトン */}
        <div className="p-4 flex flex-col gap-3">
          {/* カテゴリタグ */}
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          
          {/* 商品名 */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
          </div>

          {/* AI Deal Score */}
          <div className="h-3 w-24 bg-gray-200 rounded"></div>

          {/* 価格変動情報 */}
          <div className="h-4 w-20 bg-gray-200 rounded"></div>

          {/* 最安値との差 */}
          <div className="h-3 w-28 bg-gray-200 rounded"></div>

          {/* 期間選択ボタン */}
          <div className="flex gap-1">
            <div className="h-5 w-8 bg-gray-200 rounded"></div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
          </div>

          {/* グラフ */}
          <div className="h-10 w-full bg-gray-200 rounded"></div>

          {/* 価格とボタン */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="h-7 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

