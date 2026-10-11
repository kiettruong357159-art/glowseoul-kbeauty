import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';
import ProductCardSkeleton from '@/components/ui/skeletons/ProductCardSkeleton';

export default function HomeLoading() {
  return (
    <div style={{ padding: '32px 0 64px', minHeight: '80vh' }}>
      <div className="container">
        {/* 1. Hero Banner Skeleton */}
        <div
          style={{
            height: '380px',
            borderRadius: 'var(--radius-xl, 28px)',
            marginBottom: '48px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            padding: '48px',
            gap: '32px',
            background: 'linear-gradient(135deg, #fff0f3 0%, #fff6f0 50%, #ffe4e6 100%)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            <SkeletonBox width="140px" height="24px" borderRadius="12px" />
            <SkeletonBox width="90%" height="42px" />
            <SkeletonBox width="70%" height="42px" />
            <SkeletonBox width="80%" height="16px" style={{ marginTop: '8px' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <SkeletonBox width="140px" height="46px" borderRadius="var(--radius-full, 999px)" />
              <SkeletonBox width="140px" height="46px" borderRadius="var(--radius-full, 999px)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkeletonBox width="85%" height="280px" borderRadius="20px" />
          </div>
        </div>

        {/* 2. Category Circles/Cards Skeleton */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <SkeletonBox width="120px" height="14px" style={{ margin: '0 auto 8px' }} />
            <SkeletonBox width="240px" height="26px" style={{ margin: '0 auto' }} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((cat) => (
              <div
                key={cat}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px 12px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <SkeletonBox width="54px" height="54px" borderRadius="50%" />
                <SkeletonBox width="80px" height="14px" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Best Sellers Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SkeletonBox width="120px" height="14px" />
            <SkeletonBox width="260px" height="26px" />
          </div>
          <SkeletonBox width="100px" height="20px" />
        </div>

        {/* 4. Best Sellers Product Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
