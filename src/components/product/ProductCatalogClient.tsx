'use client';

import React, { useState } from 'react';
import ProductCard, { ProductData } from './ProductCard';
import QuickViewModal from './QuickViewModal';

export default function ProductCatalogClient({ products }: { products: ProductData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);

  if (products.length === 0) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '60px 20px',
          textAlign: 'center',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
          Không tìm thấy sản phẩm phù hợp
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
