"use client";

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function DealScoreTooltip() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="AI Deal Scoreについて"
      >
        <HelpCircle size={14} />
      </button>

      {/* ツールチップ */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 pointer-events-none">
          <div className="text-xs font-bold text-gray-900 mb-1">
            AI Deal Scoreとは？
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            AI Deal Scoreは、過去の価格推移をもとに「どれだけ今が買い時か」を100点満点で評価した指標です。過去平均との差・値下がり率・最安値更新度を考慮しています。
          </p>
          {/* 矢印 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}

