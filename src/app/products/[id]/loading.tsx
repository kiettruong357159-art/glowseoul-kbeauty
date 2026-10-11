import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';

export default function ProductDetailLoading() {
  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
          <SkeletonBox width="60px" height="14px" />
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <SkeletonBox width="80px" height="14px" />
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <SkeletonBox width="140px" height="14px" />
        </div>

        {/* 2-Column Detail Layout: Gallery (Left) + Buy Box (Right) */}
        <div
          className="responsive-grid-1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '48px',
            alignItems: 'flex-start',
            marginBottom: '60px',
          }}
        >
          {/* Left Gallery Skeleton */}
          <div>
            {/* Main Big Image (1:1) */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%', marginBottom: '16px' }}>
              <SkeletonBox
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-lg, 16px)',
                }}
              />
            </div>

            {/* 4 Thumbnails */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4].map((thumb) => (
                <SkeletonBox key={thumb} width="74px" height="74px" borderRadius="var(--radius-md, 12px)" />
              ))}
            </div>
          </div>

          {/* Right Product Purchase Box Skeleton */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 16px)',
              padding: '36px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Brand tag & Bestseller badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonBox width="80px" height="14px" />
              <SkeletonBox width="90px" height="22px" borderRadius="12px" />
            </div>

            {/* Product Title (2 lines) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SkeletonBox width="95%" height="28px" />
              <SkeletonBox width="70%" height="28px" />
            </div>

            {/* Rating and Reviews */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <SkeletonBox width="100px" height="16px" />
              <SkeletonBox width="140px" height="14px" />
            </div>

            {/* Price Box */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
              <SkeletonBox width="140px" height="34px" />
              <SkeletonBox width="90px" height="20px" />
            </div>

            {/* Short Description (3 lines) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
              <SkeletonBox width="100%" height="15px" />
              <SkeletonBox width="92%" height="15px" />
              <SkeletonBox width="60%" height="15px" />
            </div>

            {/* CTA Buttons: Add to cart & Buy now */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <SkeletonBox width="100px" height="46px" borderRadius="8px" />
              <SkeletonBox width="100%" height="46px" borderRadius="8px" />
            </div>

            {/* Guarantee chips */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
              <SkeletonBox width="33%" height="30px" borderRadius="6px" />
              <SkeletonBox width="33%" height="30px" borderRadius="6px" />
              <SkeletonBox width="33%" height="30px" borderRadius="6px" />
            </div>
          </div>
        </div>

        {/* Bottom Tabs Skeleton */}
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-lg, 16px)',
            border: '1px solid var(--color-border)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <SkeletonBox width="120px" height="24px" />
            <SkeletonBox width="120px" height="24px" />
            <SkeletonBox width="120px" height="24px" />
          </div>
          <SkeletonBox width="100%" height="16px" />
          <SkeletonBox width="90%" height="16px" />
          <SkeletonBox width="75%" height="16px" />
        </div>
      </div>
    </div>
  );
}
