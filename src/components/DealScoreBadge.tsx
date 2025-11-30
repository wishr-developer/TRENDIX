"use client";

import { useState } from 'react';
import { Info } from 'lucide-react';

interface DealScoreBadgeProps {
  score: number;
  showTooltip?: boolean;
}

/**
 * AI Deal Scoreを権威性のあるエンブレム風バッジとして表示
 */
export default function DealScoreBadge({ score, showTooltip = true }: DealScoreBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // スコアに応じたランクと色を決定
  const getScoreRank = (score: number) => {
    if (score >= 80) return { rank: 'S', color: 'from-score-metallic-gold to-yellow-400', bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100', borderColor: 'border-yellow-300', textColor: 'text-yellow-800' };
    if (score >= 60) return { rank: 'A', color: 'from-score-metallic-blue to-blue-400', bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100', borderColor: 'border-blue-300', textColor: 'text-blue-800' };
    if (score >= 40) return { rank: 'B', color: 'from-green-500 to-emerald-400', bgColor: 'bg-gradient-to-br from-green-50 to-green-100', borderColor: 'border-green-300', textColor: 'text-green-800' };
    if (score >= 20) return { rank: 'C', color: 'from-gray-400 to-gray-300', bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100', borderColor: 'border-gray-300', textColor: 'text-gray-800' };
    return { rank: 'D', color: 'from-gray-300 to-gray-200', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-600' };
  };

  const scoreRank = getScoreRank(score);

  if (score === 0) return null;

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${scoreRank.borderColor} ${scoreRank.bgColor} shadow-sm`}
        onMouseEnter={() => showTooltip && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* エンブレム風のスコア表示 */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${scoreRank.color} text-white font-bold text-sm shadow-inner`}>
          {scoreRank.rank}
        </div>
        
        {/* スコア数値 */}
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${scoreRank.textColor}`}>
            AI Deal Score
          </span>
          <span className={`text-sm font-bold ${scoreRank.textColor}`}>
            {score}/100
          </span>
        </div>

        {/* 情報アイコン */}
        {showTooltip && (
          <Info size={14} className={`${scoreRank.textColor} opacity-60`} />
        )}
      </div>

      {/* ツールチップ（算出ロジックの透明性確保） */}
      {isHovered && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50 pointer-events-none">
          <div className="text-sm font-bold text-gray-900 mb-2">
            AI Deal Score 評価基準
          </div>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-[10px]">1</span>
              </div>
              <div>
                <span className="font-semibold">価格競争力:</span> 過去平均価格との比較
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-[10px]">2</span>
              </div>
              <div>
                <span className="font-semibold">値下がり率:</span> 直近価格変動の割合
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold text-[10px]">3</span>
              </div>
              <div>
                <span className="font-semibold">最安値更新度:</span> 過去最安値との関係
              </div>
            </div>
          </div>
          {/* 矢印 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}

