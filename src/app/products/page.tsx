import React from 'react';
import { prisma } from '@/lib/db';
import { buildProductFilterQuery, FilterParams } from '@/lib/filter';
import FilterSidebar from '@/components/product/FilterSidebar';
import LiveSearch from '@/components/product/LiveSearch';
import ProductCatalogClient from '@/components/product/ProductCatalogClient';
import { CatalogFilterProvider } from '@/context/CatalogFilterContext';

export const revalidate = 0; // Dynamic rendering for filters

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { where, orderBy } = buildProductFilterQuery(params);

  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        brand: true,
        price: true,
        originalPrice: true,
        images: true,
        rating: true,
        reviewCount: true,
        isBestSeller: true,
        isNew: true,
        category: true,
        skinType: true,
      },
    }),
  ]);

  return (
    <CatalogFilterProvider>
      <div style={{ padding: '40px 0 80px' }}>
        <div className="container">
          {/* Header Bar: Title, Search, and Count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Tất Cả Sản Phẩm K-Beauty
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                Hiển thị {totalCount} sản phẩm chính hãng chuẩn Hàn
              </p>
            </div>

            <LiveSearch initialValue={params.q || ''} />
          </div>

          {/* Main Grid: Sidebar + Products */}
          <div
            className="responsive-grid-1"
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '32px',
              alignItems: 'flex-start',
            }}
          >
            <FilterSidebar />
            <ProductCatalogClient products={products} />
          </div>
        </div>
      </div>
    </CatalogFilterProvider>
  );
}
