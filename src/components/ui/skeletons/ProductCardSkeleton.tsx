import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg, 16px)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1:1 Aspect ratio Image placeholder */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        <SkeletonBox
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
          }}
        />
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        {/* Brand tag */}
        <SkeletonBox width="60px" height="12px" />

        {/* Product title: 2 lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SkeletonBox width="92%" height="16px" />
          <SkeletonBox width="65%" height="16px" />
        </div>

        {/* Rating stars placeholder */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', margin: '4px 0' }}>
          <SkeletonBox width="80px" height="13px" />
          <SkeletonBox width="30px" height="13px" />
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonBox width="90px" height="20px" borderRadius="4px" />
          <SkeletonBox width="36px" height="36px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}
