import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

interface HeroBannerProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
}

export default function HeroBanner({ badgeText, title, subtitle }: HeroBannerProps = {}) {
  return (
    <section
      style={{
        position: 'relative',
        padding: '60px 0 40px',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="hero-card">
          {/* Decorative glowing blobs */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 107, 129, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          {/* Left Text Column */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'white',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-primary)',
                boxShadow: '0 2px 10px rgba(255, 107, 129, 0.15)',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={16} />
              <span>{badgeText || 'K-Beauty Trending 2026 • 100% Chính Hãng'}</span>
            </div>

            <h1 className="hero-title">
              {title ? (
                title
              ) : (
                <>
                  Đánh Thức Làn Da Sáng Mịn{' '}
                  <span
                    style={{
                      background: 'var(--color-gradient-brand)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Căng Bóng Chuẩn Hàn
                  </span>
                </>
              )}
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-text-muted)',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              {subtitle || 'Khám phá bộ sưu tập tinh chất ốc sên COSRX, kem chống nắng Beauty of Joseon, và các thương hiệu mỹ phẩm Hàn Quốc được yêu thích nhất toàn cầu.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/products"
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                <span>Khám phá ngay</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/products?isBestSeller=true"
                className="btn-outline"
                style={{ padding: '13px 26px', fontSize: '15px', background: 'white' }}
              >
                <span>Sản phẩm bán chạy</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 107, 129, 0.15)',
              }}
            >
              <div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                  50.000+
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  Khách hàng hài lòng
                </div>
              </div>

              <div style={{ width: '1px', height: '32px', background: 'var(--color-border)' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                  4.9 <Star size={18} fill="#f59e0b" color="#f59e0b" />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  Đánh giá trung bình
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Floating Cards */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '6px solid white',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
                alt="K-Beauty Luxury Skincare"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating review card */}
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '16px',
                  right: '16px',
                  padding: '12px 16px',
                  borderRadius: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-main)', marginLeft: '4px' }}>
                    Top 1 Bestseller
                  </span>
                </div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  COSRX Snail Mucin 96%
                </p>
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>
                  285.000₫ • Đã bán 2.4k+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
