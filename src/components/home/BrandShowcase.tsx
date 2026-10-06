import React from 'react';
import Link from 'next/link';

const brands = [
  { name: 'COSRX', tag: 'Dược mỹ phẩm dịu nhẹ' },
  { name: 'Beauty of Joseon', tag: 'Thảo mộc Hanbang hoàng gia' },
  { name: 'Laneige', tag: 'Dưỡng ẩm chuyên sâu' },
  { name: 'Skin1004', tag: 'Rau má Madagascar tinh khiết' },
  { name: 'Torriden', tag: '5D Hyaluronic Acid cấp nước' },
  { name: 'Anua', tag: 'Diếp cá làm dịu da nhạy cảm' },
  { name: 'Rom&nd', tag: 'Son môi trendy số 1 giới trẻ' },
  { name: 'Innisfree', tag: 'Trà xanh thiên nhiên đảo Jeju' },
];

export default function BrandShowcase() {
  return (
    <section style={{ padding: '40px 0 60px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>
            Đối Tác Chính Hãng
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Thương Hiệu K-Beauty Đình Đám
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
          }}
        >
          {brands.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              style={{
                background: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 12px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: 'var(--color-text-main)',
                  marginBottom: '4px',
                }}
              >
                {b.name}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {b.tag}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
