'use client';

import { X, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { useEffect, useRef } from 'react';

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAlertClick?: (product: Product) => void;
  onFavoriteToggle?: (asin: string, isFavorite: boolean) => void;
}

/**
 * お気に入り一覧モーダル
 */
export default function FavoriteModal({ 
  isOpen, 
  onClose, 
  products,
  onAlertClick,
  onFavoriteToggle
}: FavoriteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // モーダルが開いた時にフォーカスを設定
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // フォーカストラップ
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
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
  }, [isOpen]);

  // モーダルが開いている時、背景のスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const mainContent = document.querySelector('main');
      const header = document.querySelector('header');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
      if (header) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* モーダル */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-modal-title"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <h2 id="favorite-modal-title" className="text-2xl font-bold text-gray-900">
              お気に入り一覧
            </h2>
            <span className="text-sm text-gray-500">
              ({products.length}件)
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="モーダルを閉じる"
          >
            <X size={24} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                お気に入り商品がありません
              </h3>
              <p className="text-gray-600 mb-6">
                商品カードのハートアイコンをクリックして、お気に入りに追加してください。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAlertClick={onAlertClick}
                  onFavoriteToggle={onFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

