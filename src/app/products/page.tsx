import React from 'react';
import { prisma } from '@/lib/db';
import { buildProductFilterQuery, FilterParams } from '@/lib/filter';
import FilterSidebar from '@/components/product/FilterSidebar';
import LiveSearch from '@/components/product/LiveSearch';
import ProductCatalogClient from '@/components/product/ProductCatalogClient';

export const revalidate = 0; // Dynamic rendering for filters

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { where, orderBy } = buildProductFilterQuery(params);

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return (
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
              Hiển thị {products.length} sản phẩm chính hãng chuẩn Hàn
            </p>
          </div>

          <LiveSearch initialValue={params.q || ''} />
        </div>

        {/* Main Grid: Sidebar + Products */}
        <div
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
  );
}
