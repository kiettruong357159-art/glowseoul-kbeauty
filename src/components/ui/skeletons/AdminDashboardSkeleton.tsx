import React from 'react';
import SkeletonBox from './SkeletonBox';
import AdminTableSkeleton from './AdminTableSkeleton';

export default function AdminDashboardSkeleton() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar Skeleton (hidden on small mobile) */}
      <aside
        style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid var(--color-border)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flexShrink: 0,
        }}
      >
        {/* Admin Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
          <SkeletonBox width="36px" height="36px" borderRadius="10px" />
          <SkeletonBox width="110px" height="20px" />
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
              }}
            >
              <SkeletonBox width="20px" height="20px" borderRadius="4px" />
              <SkeletonBox width={item === 1 ? '100px' : item === 2 ? '80px' : '110px'} height="16px" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '68px',
            background: 'white',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <SkeletonBox width="280px" height="38px" borderRadius="8px" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SkeletonBox width="36px" height="36px" borderRadius="50%" />
            <SkeletonBox width="36px" height="36px" borderRadius="50%" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SkeletonBox width="38px" height="38px" borderRadius="50%" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <SkeletonBox width="80px" height="14px" />
                <SkeletonBox width="50px" height="11px" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Page Title & Action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonBox width="200px" height="26px" />
              <SkeletonBox width="140px" height="14px" />
            </div>
            <SkeletonBox width="120px" height="38px" borderRadius="8px" />
          </div>

          {/* 4 KPI Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg, 16px)',
                  padding: '20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SkeletonBox width="90px" height="14px" />
                  <SkeletonBox width="38px" height="38px" borderRadius="10px" />
                </div>
                <SkeletonBox width="130px" height="28px" />
                <SkeletonBox width="110px" height="14px" />
              </div>
            ))}
          </div>

          {/* Table Section */}
          <AdminTableSkeleton rows={5} />
        </main>
      </div>
    </div>
  );
}
