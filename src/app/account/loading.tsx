import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';
import AccountOrdersSkeleton from '@/components/ui/skeletons/AccountOrdersSkeleton';

export default function AccountLoading() {
  return (
    <div style={{ padding: '40px 0 80px', minHeight: '80vh' }}>
      <div className="container">
        {/* Top Profile Header Card Skeleton */}
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl, 24px)',
            border: '1px solid var(--color-border)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <SkeletonBox width="72px" height="72px" borderRadius="50%" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <SkeletonBox width="180px" height="24px" />
                <SkeletonBox width="80px" height="22px" borderRadius="12px" />
              </div>
              <SkeletonBox width="220px" height="14px" />
            </div>
          </div>
        </div>

        {/* 2-Column Account Layout: Sidebar (Left 280px) + Content (Right) */}
        <div
          className="responsive-grid-1"
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Navigation Tabs Skeleton */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 16px)',
              border: '1px solid var(--color-border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {[1, 2, 3].map((tab) => (
              <div
                key={tab}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: tab === 1 ? '#faf4f2' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonBox width="20px" height="20px" borderRadius="4px" />
                  <SkeletonBox width={tab === 1 ? '110px' : tab === 2 ? '130px' : '120px'} height="15px" />
                </div>
                {tab !== 3 && <SkeletonBox width="24px" height="20px" borderRadius="10px" />}
              </div>
            ))}
          </div>

          {/* Right Content Panel Skeleton */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 16px)',
              border: '1px solid var(--color-border)',
              padding: '32px',
            }}
          >
            {/* Tab Title Header */}
            <div style={{ marginBottom: '24px' }}>
              <SkeletonBox width="160px" height="24px" style={{ marginBottom: '8px' }} />
              <SkeletonBox width="280px" height="14px" />
            </div>

            {/* Orders list skeleton */}
            <AccountOrdersSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
