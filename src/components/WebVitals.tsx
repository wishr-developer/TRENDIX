'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendWebVitals, isGAEnabled } from '@/lib/gtag';

/**
 * Web Vitalsメトリクスの型定義
 */
interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

/**
 * Web Vitals計測コンポーネント
 * Core Web Vitals（LCP, FID, CLS, INP）とその他のパフォーマンス指標を計測
 */
export default function WebVitals() {
  /**
   * メトリクスをコンソールに出力する関数
   */
  const handleMetric = (metric: WebVitalsMetric) => {
    // 開発環境でのみ詳細なログを出力
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        entries: metric.entries,
      });
    } else {
      // 本番環境では簡潔なログのみ
      console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
    }

    // Google Analytics 4に送信
    if (isGAEnabled) {
      sendWebVitals({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  };

  // useReportWebVitalsフックを使用してWeb Vitalsを計測
  useReportWebVitals(handleMetric);

  // このコンポーネントはUIをレンダリングしない
  return null;
}

