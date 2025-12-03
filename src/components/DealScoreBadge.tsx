"use client";

interface DealScoreBadgeProps {
  score: number;
  showTooltip?: boolean;
}

/**
 * DAISO型：AI Deal Scoreを小さなラベル＋数字のみで表示
 * - 40点未満：非表示
 * - 40–59点：「参考」
 * - 60点以上のみ「AI Deal Score」として表示
 * - 派手なグラデーション禁止
 */
export default function DealScoreBadge({ score }: DealScoreBadgeProps) {
  // 40点未満は非表示
  if (score < 40) return null;

  const label = score >= 60 ? 'AI Deal Score' : '参考';

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 border border-gray-300 bg-white">
      <span>{label}</span>
      <span className="font-sans">{score}</span>
    </span>
  );
}

