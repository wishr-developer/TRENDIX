'use client';

import { Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleMobileSearchOpen = () => {
    setIsMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
  };

  // ESCキーでドロワーを閉じる
  useEffect(() => {
    if (!isMobileSearchOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMobileSearchClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileSearchOpen]);

  // ドロワーが開いた時に検索入力にフォーカス
  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileSearchOpen]);

  // フォーカストラップ: Tabキーでドロワー内のフォーカス可能な要素を循環させる
  useEffect(() => {
    if (!isMobileSearchOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isMobileSearchOpen]);

  // モバイル検索ドロワーが開いている時、背景のスクロールを無効化
  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
      // 背景コンテンツをスクリーンリーダーから隠す
      const mainContent = document.querySelector('main');
      const header = document.querySelector('header');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
      if (header && !drawerRef.current?.contains(header)) {
        header.setAttribute('aria-hidden', 'true');
      }
    } else {
      document.body.style.overflow = 'unset';
      const mainContent = document.querySelector('main');
      const header = document.querySelector('header');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
      if (header) {
        header.removeAttribute('aria-hidden');
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      const mainContent = document.querySelector('main');
      const header = document.querySelector('header');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
      if (header) {
        header.removeAttribute('aria-hidden');
      }
    };
  }, [isMobileSearchOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* ロゴ */}
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900">XIORA</span>
            <span className="text-xl font-light text-slate-500 ml-1">TREND</span>
          </Link>

          {/* 検索バー（PCのみ表示） */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="何をお探しですか？（例: MacBook, スニーカー...）" 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              aria-label="商品を検索"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600" aria-label="検索">
              <Search size={18} />
            </button>
          </div>

          {/* 右側メニュー */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* モバイル: カテゴリ・ランキングリンク */}
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-black md:hidden"
            >
              カテゴリ
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-black md:hidden"
            >
              ランキング
            </Link>
            
            {/* PC: カテゴリ・ランキングリンク */}
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-black hidden sm:block md:block"
            >
              カテゴリ
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-black hidden sm:block md:block"
            >
              ランキング
            </Link>

            {/* ショッピングバッグアイコン */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" aria-label="ショッピングバッグ">
              <ShoppingBag size={20} />
            </button>

            {/* モバイル: 検索アイコン */}
            <button 
              onClick={handleMobileSearchOpen}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              aria-label="検索"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* モバイル検索ドロワー */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleMobileSearchClose}
            aria-hidden="true"
          ></div>

          {/* ドロワー */}
          <div 
            ref={drawerRef}
            className="absolute top-0 left-0 right-0 bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-drawer-title"
          >
            {/* ヘッダー */}
            <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-200">
              <button
                ref={closeButtonRef}
                onClick={handleMobileSearchClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="検索ドロワーを閉じる"
              >
                <X size={20} />
              </button>
              <div className="flex-1">
                <h2 id="search-drawer-title" className="text-lg font-bold text-gray-900">検索</h2>
              </div>
            </div>

            {/* 検索入力フィールド */}
            <div className="p-4">
              <div className="relative">
                <label htmlFor="mobile-search-input" className="sr-only">
                  商品を検索
                </label>
                <input 
                  ref={searchInputRef}
                  id="mobile-search-input"
                  type="text" 
                  placeholder="何をお探しですか？（例: MacBook, スニーカー...）" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  aria-label="商品を検索"
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-blue-600" aria-label="検索">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
