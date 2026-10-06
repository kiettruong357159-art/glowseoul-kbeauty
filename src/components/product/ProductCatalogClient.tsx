'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard, { ProductData } from './ProductCard';
import QuickViewModal from './QuickViewModal';
import MobileFilterDrawer from './MobileFilterDrawer';
import { useCatalogFilter } from '@/context/CatalogFilterContext';

export default function ProductCatalogClient({ products }: { products: ProductData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { isPending, filters } = useCatalogFilter();

  const activeCount = [
    filters.category,
    filters.skinType,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

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

      {/* Mobile Filter Trigger Button */}
      <div
        className="show-on-mobile-flex"
        style={{
          marginBottom: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'white',
            border: '1.5px solid var(--color-border)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--color-text-main)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <SlidersHorizontal size={16} color="var(--color-primary)" />
          <span>Bộ lọc & Sắp xếp</span>
          {activeCount > 0 && (
            <span
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeCount}
            </span>
          )}
        </button>
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
          className="responsive-grid-2"
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

      {/* Mobile Filter Bottom Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </div>
  );
}
