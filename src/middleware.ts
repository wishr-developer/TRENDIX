import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n';

/**
 * next-intlミドルウェアの作成
 */
const intlMiddleware = createMiddleware({
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
 * 国際化ミドルウェア
 * 商品ページ（/products/*）を除外して、next-intlミドルウェアを適用
 */
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 商品ページ（/products/[asin]）を除外
  if (pathname.startsWith('/products/')) {
    return NextResponse.next();
  }
  
  // その他のパスにはnext-intlミドルウェアを適用
  return intlMiddleware(request);
}

/**
 * ミドルウェアを適用するパス
 */
export const config = {
  // すべてのパスに適用するが、特定の静的アセットは除外する
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sitemap.xml|robots.txt|images|icons|locales).*)',
  ],
};

