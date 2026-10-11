import React from 'react';
import SkeletonBox from '@/components/ui/skeletons/SkeletonBox';

export default function QuizLoading() {
  return (
    <div style={{ padding: '40px 0 80px', minHeight: '80vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Quiz Header & Progress Skeleton */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <SkeletonBox width="140px" height="24px" borderRadius="12px" style={{ margin: '0 auto 12px' }} />
          <SkeletonBox width="280px" height="30px" style={{ margin: '0 auto 8px' }} />
          <SkeletonBox width="360px" height="15px" style={{ margin: '0 auto 24px', maxWidth: '90%' }} />

          {/* 3 Steps indicator */}
          <div style={{ display: 'flex', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
            <SkeletonBox height="6px" borderRadius="3px" style={{ flex: 1 }} />
            <SkeletonBox height="6px" borderRadius="3px" style={{ flex: 1 }} />
            <SkeletonBox height="6px" borderRadius="3px" style={{ flex: 1 }} />
          </div>
        </div>

        {/* Question Card Box Skeleton */}
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl, 24px)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonBox width="60%" height="24px" />
            <SkeletonBox width="45%" height="15px" />
          </div>

          {/* 4 Choices Skeletons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md, 12px)',
                  border: '1.5px solid var(--color-border-subtle)',
                  background: '#faf8f7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <SkeletonBox width="40px" height="40px" borderRadius="50%" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <SkeletonBox width="140px" height="16px" />
                    <SkeletonBox width="200px" height="13px" />
                  </div>
                </div>
                <SkeletonBox width="24px" height="24px" borderRadius="50%" />
              </div>
            ))}
          </div>

          {/* Action button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <SkeletonBox width="120px" height="44px" borderRadius="var(--radius-full, 999px)" />
          </div>
        </div>
      </div>
    </div>
  );
}
