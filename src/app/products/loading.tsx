import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';
import ProductCardSkeleton from '@/components/ui/skeletons/ProductCardSkeleton';

export default function ProductsLoading() {
  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Bar Skeleton: Title & LiveSearch */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonBox width="260px" height="32px" />
            <SkeletonBox width="180px" height="16px" />
          </div>

          <SkeletonBox width="280px" height="42px" borderRadius="var(--radius-full, 999px)" />
        </div>

        {/* Main 2-Column Catalog Layout: FilterSidebar (260px) + Products Grid */}
        <div
          className="responsive-grid-1"
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Filter Sidebar Skeleton */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 16px)',
              padding: '24px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Filter Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonBox width="100px" height="20px" />
              <SkeletonBox width="50px" height="14px" />
            </div>

            {/* Filter Group 1: Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SkeletonBox width="80px" height="15px" />
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonBox width="16px" height="16px" borderRadius="4px" />
                  <SkeletonBox width={idx % 2 === 0 ? '120px' : '90px'} height="14px" />
                </div>
              ))}
            </div>

            {/* Filter Group 2: Brands */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SkeletonBox width="90px" height="15px" />
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonBox width="16px" height="16px" borderRadius="4px" />
                  <SkeletonBox width={idx % 2 === 0 ? '110px' : '85px'} height="14px" />
                </div>
              ))}
            </div>

            {/* Price Range Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonBox width="100px" height="15px" />
              <SkeletonBox width="100%" height="8px" borderRadius="4px" />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonBox width="60px" height="12px" />
                <SkeletonBox width="60px" height="12px" />
              </div>
            </div>
          </div>

          {/* Right Product Grid Skeleton (8 Product Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
              <ProductCardSkeleton key={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
