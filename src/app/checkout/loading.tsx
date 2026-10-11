import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';

export default function CheckoutLoading() {
  return (
    <div style={{ padding: '40px 0 80px', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <SkeletonBox width="200px" height="32px" style={{ marginBottom: '8px' }} />
          <SkeletonBox width="300px" height="15px" />
        </div>

        {/* 2-Column Checkout Layout */}
        <div
          className="responsive-grid-1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Information Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Customer Details Box */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '28px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <SkeletonBox width="180px" height="20px" style={{ marginBottom: '6px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <SkeletonBox height="42px" borderRadius="8px" />
                <SkeletonBox height="42px" borderRadius="8px" />
              </div>
              <SkeletonBox height="42px" borderRadius="8px" />
              <SkeletonBox height="42px" borderRadius="8px" />
              <SkeletonBox height="70px" borderRadius="8px" />
            </div>

            {/* Payment Method Selector Box */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '28px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <SkeletonBox width="200px" height="20px" style={{ marginBottom: '4px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <SkeletonBox height="64px" borderRadius="10px" />
                <SkeletonBox height="64px" borderRadius="10px" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg, 16px)',
              padding: '28px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <SkeletonBox width="160px" height="20px" />

            {/* List of items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '16px' }}>
              {[1, 2].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <SkeletonBox width="50px" height="50px" borderRadius="8px" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <SkeletonBox width="85%" height="15px" />
                    <SkeletonBox width="50%" height="12px" />
                  </div>
                  <SkeletonBox width="70px" height="15px" />
                </div>
              ))}
            </div>

            {/* Voucher input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <SkeletonBox height="38px" borderRadius="8px" style={{ flex: 1 }} />
              <SkeletonBox width="90px" height="38px" borderRadius="8px" />
            </div>

            {/* Price lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonBox width="80px" height="14px" />
                <SkeletonBox width="90px" height="14px" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonBox width="90px" height="14px" />
                <SkeletonBox width="70px" height="14px" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <SkeletonBox width="100px" height="18px" />
                <SkeletonBox width="120px" height="22px" />
              </div>
            </div>

            {/* Checkout Button */}
            <SkeletonBox width="100%" height="46px" borderRadius="8px" />
          </div>
        </div>
      </div>
    </div>
  );
}
