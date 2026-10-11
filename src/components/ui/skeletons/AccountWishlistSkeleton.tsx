import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function AccountWishlistSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
      }}
    >
      {[1, 2, 3, 4].map((idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md, 12px)',
            overflow: 'hidden',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Top Delete button placeholder */}
          <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
            <SkeletonBox width="32px" height="32px" borderRadius="50%" />
          </div>

          {/* Image placeholder */}
          <SkeletonBox height="180px" borderRadius={0} />

          {/* Card Body */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
            <SkeletonBox width="60px" height="12px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonBox width="90%" height="15px" />
              <SkeletonBox width="70%" height="15px" />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonBox width="85px" height="18px" />
              <SkeletonBox width="100%" height="34px" borderRadius="var(--radius-sm, 6px)" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
