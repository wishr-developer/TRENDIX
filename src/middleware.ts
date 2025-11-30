import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n';

/**
 * 国際化ミドルウェア
 * パスプレフィックス戦略（/en/, /ja/）でルーティングを制御
 * 
 * 注意: 現在は基盤のみ実装。実際の使用には、すべてのページを app/[locale] フォルダに移動する必要があります。
 * 段階的な移行のため、現在はデフォルトロケール（日本語）のみをサポートします。
 */
export default createMiddleware({
  // サポートするロケール
  locales,
  
  // デフォルトロケール
  defaultLocale,
  
  // デフォルトロケールのプレフィックスを非表示（既存のURL構造を維持）
  localePrefix: 'as-needed',
  
  // ロケール検出を無効化（URLパスから判定）
  localeDetection: false,
});

/**
 * ミドルウェアを適用するパス
 */
export const config = {
  // すべてのパスに適用（APIルートと静的ファイルを除く）
  matcher: [
    // すべてのパスに適用
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

