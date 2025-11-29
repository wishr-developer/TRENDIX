"use client";

/**
 * ヘッダーコンポーネント（プロフェッショナルなSaaS管理画面風）
 */
export default function Header() {
  return (
    <header className="h-14 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span>Dashboards</span>
        <span className="text-text-dim">/</span>
        <span className="text-text-main">Market Overview</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-2.5 text-text-dim"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="h-9 w-64 bg-surface border border-border rounded-md pl-9 pr-3 text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:border-text-muted transition-colors"
          />
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surfaceHighlight text-text-muted transition-colors">
          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
