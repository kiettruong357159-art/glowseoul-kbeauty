import React from 'react';
import Link from 'next/link';

export interface BrandItem {
  id?: string;
  name: string;
  slug?: string;
  tag?: string | null;
  origin?: string | null;
  logo?: string | null;
}

interface BrandShowcaseProps {
  brands?: BrandItem[];
}

export default function BrandShowcase({ brands = [] }: BrandShowcaseProps) {
  if (!brands || brands.length === 0) return null;
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
          className="responsive-grid-2"
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
              prefetch={true}
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
                {b.tag || b.origin || 'Chính hãng Hàn Quốc'}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
