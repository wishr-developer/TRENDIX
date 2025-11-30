'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FavoritesList from '@/components/FavoritesList';
import AlertModal from '@/components/AlertModal';
import { Product } from '@/types/product';

interface FavoritesPageClientProps {
  allProducts: Product[];
}

/**
 * お気に入りページのクライアントコンポーネント
 * アラートモーダルの状態管理を行う
 */
export default function FavoritesPageClient({ allProducts }: FavoritesPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAlertClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      <FavoritesList 
        allProducts={allProducts} 
        onAlertClick={handleAlertClick}
      />
      <AlertModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={selectedProduct} 
      />
    </>
  );
}

