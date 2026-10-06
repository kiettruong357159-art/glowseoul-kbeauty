import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import HeroBanner from '@/components/home/HeroBanner';
import SkinTypeSelector from '@/components/home/SkinTypeSelector';
import CategoryGrid from '@/components/home/CategoryGrid';
import BrandShowcase from '@/components/home/BrandShowcase';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  const bestSellers = await prisma.product.findMany({
    where: { isBestSeller: true },
    take: 8,
  });

  const newArrivals = await prisma.product.findMany({
    where: { isNew: true },
    take: 4,
  });

  return (
    <div>
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Skin Type Filter Shortcuts */}
      <SkinTypeSelector />

      {/* Featured Categories */}
      <CategoryGrid />

      {/* Best Sellers Section */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  letterSpacing: '1px',
                }}
              >
                Top Bán Chạy
              </span>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  marginTop: '4px',
                  letterSpacing: '-0.5px',
                }}
              >
                Sản Phẩm Được Yêu Thích Nhất
              </h2>
            </div>
            <Link
              href="/products?isBestSeller=true"
              style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}
            >
              Xem tất cả →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section style={{ padding: '40px 0', background: 'var(--color-bg-rose)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '28px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    letterSpacing: '1px',
                  }}
                >
                  Mới Lên Kệ
                </span>
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    marginTop: '4px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Xu Hướng K-Beauty Mới Nhất
                </h2>
              </div>
              <Link
                href="/products?isNew=true"
                style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}
              >
                Xem tất cả →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Showcase */}
      <BrandShowcase />
    </div>
  );
}
