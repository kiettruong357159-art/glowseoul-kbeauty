import React from 'react';
import SkeletonBox from './SkeletonBox';

export default function AccountOrdersSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg, 16px)',
            background: 'white',
            overflow: 'hidden',
          }}
        >
          {/* Order Header bar */}
          <div
            style={{
              padding: '16px 20px',
              background: '#faf8f7',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <SkeletonBox width="110px" height="18px" />
              <SkeletonBox width="90px" height="14px" />
            </div>
            <SkeletonBox width="100px" height="24px" borderRadius="12px" />
          </div>

          {/* Order Items list */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1, 2].map((itemIdx) => (
                <div
                  key={itemIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: itemIdx === 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <SkeletonBox width="46px" height="46px" borderRadius="8px" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <SkeletonBox width="200px" height="15px" />
                      <SkeletonBox width="80px" height="12px" />
                    </div>
                  </div>
                  <SkeletonBox width="80px" height="16px" />
                </div>
              ))}
            </div>

            {/* Order footer */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <SkeletonBox width="80px" height="14px" />
                <SkeletonBox width="100px" height="20px" />
              </div>
              <SkeletonBox width="110px" height="34px" borderRadius="20px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
