'use client';

import React, { useState } from 'react';
import ProductCard, { ProductData } from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { useCatalogFilter } from '@/context/CatalogFilterContext';

export default function ProductCatalogClient({ products }: { products: ProductData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);
  const { isPending } = useCatalogFilter();

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
      {/* Top subtle shimmer progress bar during filter transition */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          zIndex: 30,
          height: '3px',
          marginBottom: '16px',
          opacity: isPending ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <div className="filter-shimmer-bar" />
      </div>

      {products.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
            opacity: isPending ? 0.65 : 1,
            transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: isPending ? 'none' : 'auto',
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
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
