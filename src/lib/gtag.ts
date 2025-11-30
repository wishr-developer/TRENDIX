/**
 * Google Analytics 4 (GA4) ユーティリティ関数
 * gtagコマンドをラップして、型安全なイベント送信を実現
 */

// GA4の測定ID（環境変数から取得）
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// GA4が有効かどうかを判定
export const isGAEnabled = GA_ID !== '';

/**
 * gtag関数の型定義
 */
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * ページビューを送信
 * @param url ページのURL（通常はpathname）
 */
export const pageview = (url: string) => {
  if (!isGAEnabled || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

/**
 * カスタムイベントを送信
 * @param action イベントアクション名
 * @param category イベントカテゴリ（オプション）
 * @param label イベントラベル（オプション）
 * @param value イベント値（オプション）
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  if (!isGAEnabled || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Web Vitalsメトリクスを送信
 * @param metric Web Vitalsメトリクス
 */
export const sendWebVitals = (metric: {
  name: string;
  value: number;
  rating?: string;
  id?: string;
}) => {
  if (!isGAEnabled || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Web VitalsイベントをGA4に送信
  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating || 'unknown',
    metric_id: metric.id || '',
    event_category: 'Web Vitals',
    event_label: metric.name,
    non_interaction: true, // ユーザーインタラクションではないため
  });
};

