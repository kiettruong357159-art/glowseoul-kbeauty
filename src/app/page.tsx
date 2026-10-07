import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
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

      {/* Smart Skin Routine Quiz Feature Banner */}
      <section style={{ padding: '20px 0 40px' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '540px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  background: 'white',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={14} /> Trắc Nghiệm Thông Minh
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-text-main)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
                Chưa biết da mình hợp sản phẩm nào?
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                Khám phá Routine 4 bước chuẩn Glass Skin cá nhân hóa chỉ trong 1 phút, nhận ngay voucher giảm <strong>10%</strong> cho toàn bộ combo!
              </p>
              <Link
                href="/quiz"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '15px',
                  fontWeight: '800',
                  textDecoration: 'none',
                }}
              >
                <span>Bắt đầu trắc nghiệm ngay</span>
                <Sparkles size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
              className="hide-on-mobile"
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-primary)' }}>1 Phút</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Chẩn đoán da</div>
              </div>
              <div
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>-10%</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Giảm trọn combo</div>
              </div>
              <div
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366f1' }}>4 Bước</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Chuẩn Glass Skin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <BrandShowcase />
    </div>
  );
}
