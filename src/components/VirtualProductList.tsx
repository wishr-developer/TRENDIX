'use client';

import { useMemo } from 'react';
import { List } from 'react-window';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface VirtualProductListProps {
  products: Product[];
  width: number;
  height: number;
  onAlertClick?: (product: Product) => void;
  onFavoriteToggle?: (asin: string, isFavorite: boolean) => void;
}

/**
 * 仮想スクロール対応の商品リストコンポーネント
 * react-windowを使用して大量の商品を効率的に表示
 */
export default function VirtualProductList({
  products,
  width,
  height,
  onAlertClick,
  onFavoriteToggle,
}: VirtualProductListProps) {
  // 画面サイズに応じて列数を決定（レスポンシブ対応）
  const columnsPerRow = useMemo(() => {
    if (width >= 1024) return 3; // lg以上: 3列
    if (width >= 768) return 2;   // md以上: 2列
    return 1;                     // モバイル: 1列
  }, [width]);

  // 商品カードの高さ（レスポンシブ対応・最適化）
  const itemHeight = useMemo(() => {
    if (width >= 1024) return 500; // PC: 高め（グラフや詳細情報を考慮）
    if (width >= 768) return 460;  // タブレット
    return 420;                    // モバイル（横並びレイアウトを考慮）
  }, [width]);

  // 列幅の計算（ガップを考慮）
  const columnWidth = useMemo(() => {
    const gap = width >= 768 ? 24 : 16; // gap-6 (24px) or gap-4 (16px)
    const containerPadding = width >= 768 ? 0 : 32; // モバイルは左右16pxずつ
    const availableWidth = width - containerPadding;
    return Math.floor((availableWidth - gap * (columnsPerRow - 1)) / columnsPerRow);
  }, [width, columnsPerRow]);

  // 行数を計算（商品数を列数で割って切り上げ）
  const rowCount = Math.ceil(products.length / columnsPerRow);

  /**
   * 各行をレンダリングする関数
   */
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    // この行に表示する商品のインデックスを計算
    const startIndex = index * columnsPerRow;
    const endIndex = Math.min(startIndex + columnsPerRow, products.length);
    const rowProducts = products.slice(startIndex, endIndex);

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          gap: width >= 768 ? '24px' : '16px',
          paddingLeft: width >= 768 ? '0' : '16px',
          paddingRight: width >= 768 ? '0' : '16px',
        }}
      >
        {rowProducts.map((product, colIndex) => {
          const globalIndex = startIndex + colIndex;
          return (
            <div
              key={product.id}
              style={{
                width: `${columnWidth}px`,
                flexShrink: 0,
              }}
            >
              <ProductCard
                product={product}
                isPriority={globalIndex < 3} // 最初の3商品を優先読み込み
                onAlertClick={onAlertClick}
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          );
        })}
        {/* 空のスペースを埋める（最後の行が列数に満たない場合） */}
        {rowProducts.length < columnsPerRow &&
          Array.from({ length: columnsPerRow - rowProducts.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{ width: `${columnWidth}px`, flexShrink: 0 }} />
          ))}
      </div>
    );
  };

  // 商品が0件の場合は何も表示しない（親コンポーネントで空状態を処理）
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <List
        rowCount={rowCount}
        rowHeight={itemHeight}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        overscanCount={2} // パフォーマンス最適化：ビューポート外の2行を事前レンダリング
        rowComponent={Row as any}
        rowProps={{}}
      />
    </div>
  );
}

