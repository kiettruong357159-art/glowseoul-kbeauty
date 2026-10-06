import React from 'react';
import { Package, Layers, Award, Ticket } from 'lucide-react';

interface AdminStatsCardsProps {
  productCount: number;
  categoryCount: number;
  brandCount: number;
  couponCount: number;
}

export default function AdminStatsCards({
  productCount,
  categoryCount,
  brandCount,
  couponCount,
}: AdminStatsCardsProps) {
  const stats = [
    {
      label: 'Sản phẩm kinh doanh',
      value: productCount,
      icon: Package,
      color: '#ff6b81',
      bg: 'rgba(255, 107, 129, 0.1)',
      hint: 'Mỹ phẩm đang bày bán',
    },
    {
      label: 'Danh mục phân loại',
      value: categoryCount,
      icon: Layers,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      hint: 'Serum, Chống nắng, Toner...',
    },
    {
      label: 'Thương hiệu đối tác',
      value: brandCount,
      icon: Award,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
      hint: 'COSRX, Laneige, BOJ...',
    },
    {
      label: 'Mã voucher hoạt động',
      value: couponCount,
      icon: Ticket,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      hint: 'KBEAUTY10, GLOW20...',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}
            >
              <IconComponent size={24} />
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-text-main)', lineHeight: '1' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {stat.hint}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
