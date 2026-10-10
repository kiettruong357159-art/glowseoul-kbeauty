import React from 'react';

export default function Loading() {
  return (
    <div style={{ padding: '32px 0 64px', minHeight: '60vh' }}>
      <div className="container">
        {/* Top Hero Banner Skeleton */}
        <div
          style={{
            height: '240px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(90deg, #f0eae6 25%, #f9f5f3 50%, #f0eae6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            marginBottom: '40px',
          }}
        />

        {/* Section Header Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div
              style={{
                width: '120px',
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                background: '#f0eae6',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                width: '260px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: '#e8e2de',
              }}
            />
          </div>
          <div
            style={{
              width: '80px',
              height: '18px',
              borderRadius: 'var(--radius-sm)',
              background: '#f0eae6',
            }}
          />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Skeleton */}
              <div
                style={{
                  width: '100%',
                  paddingTop: '100%',
                  background: 'linear-gradient(90deg, #f0eae6 25%, #f9f5f3 50%, #f0eae6 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />

              {/* Text Skeleton */}
              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#f0eae6',
                    marginBottom: '8px',
                  }}
                />
                <div
                  style={{
                    width: '90%',
                    height: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#e8e2de',
                    marginBottom: '12px',
                  }}
                />
                <div
                  style={{
                    width: '50%',
                    height: '18px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffccd4',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
