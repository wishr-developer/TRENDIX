'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, isGAEnabled } from '@/lib/gtag';

/**
 * Google Analytics 4 トラッキングコンポーネント
 * ページ遷移を自動的にトラッキング
 */
export default function GATracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // GA4が有効でない場合は何もしない
    if (!isGAEnabled) {
      return;
    }

    // ページ遷移をトラッキング
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams]);

  // このコンポーネントはUIをレンダリングしない
  return null;
}

