import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
          <SkeletonBox width="260px" height="38px" borderRadius="8px" />
          <SkeletonBox width="140px" height="38px" borderRadius="8px" />
        </div>
        <SkeletonBox width="140px" height="38px" borderRadius="8px" />
      </div>

      {/* Table Container */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 2fr 1fr 1fr 100px',
            padding: '14px 20px',
            background: '#faf8f7',
            borderBottom: '1px solid var(--color-border)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <SkeletonBox width="50px" height="14px" />
          <SkeletonBox width="120px" height="14px" />
          <SkeletonBox width="80px" height="14px" />
          <SkeletonBox width="70px" height="14px" />
          <SkeletonBox width="60px" height="14px" />
        </div>

        {/* Table Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: rows }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 100px',
                padding: '16px 20px',
                borderBottom: idx === rows - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {/* Thumbnail */}
              <SkeletonBox width="46px" height="46px" borderRadius="8px" />

              {/* Title & info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SkeletonBox width="80%" height="16px" />
                <SkeletonBox width="40%" height="12px" />
              </div>

              {/* Category / Meta */}
              <SkeletonBox width="85px" height="14px" />

              {/* Price / Status */}
              <SkeletonBox width="90px" height="24px" borderRadius="12px" />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <SkeletonBox width="28px" height="28px" borderRadius="6px" />
                <SkeletonBox width="28px" height="28px" borderRadius="6px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
