import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';

export default function OrderDetailLoading() {
  return (
    <div style={{ padding: '50px 0 90px', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Success Header Card Skeleton */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 32px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Checkmark circle placeholder */}
          <SkeletonBox width="64px" height="64px" borderRadius="50%" />

          <SkeletonBox width="140px" height="14px" />
          <SkeletonBox width="260px" height="28px" />
          <SkeletonBox width="380px" height="15px" style={{ maxWidth: '90%' }} />

          {/* 4-Step Horizontal Tracker Bar Skeleton */}
          <div
            style={{
              width: '100%',
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              padding: '24px 0',
              margin: '20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {[1, 2, 3, 4].map((step) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <SkeletonBox width="32px" height="32px" borderRadius="50%" />
                <SkeletonBox width="70px" height="12px" />
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card Skeleton */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <SkeletonBox width="180px" height="22px" />

          {/* Order Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <SkeletonBox width="56px" height="56px" borderRadius="8px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonBox width="75%" height="16px" />
                  <SkeletonBox width="40%" height="13px" />
                </div>
                <SkeletonBox width="80px" height="16px" />
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SkeletonBox width="90px" height="14px" />
              <SkeletonBox width="100px" height="14px" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SkeletonBox width="80px" height="14px" />
              <SkeletonBox width="70px" height="14px" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
              <SkeletonBox width="110px" height="20px" />
              <SkeletonBox width="130px" height="24px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
