import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, RefreshCw, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'white',
        borderTop: '1px solid var(--color-border)',
        marginTop: '80px',
        padding: '60px 0 30px',
      }}
    >
      <div className="container">
        {/* Value Propositions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            paddingBottom: '50px',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '50px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                Miễn phí vận chuyển
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Đơn hàng từ 399.000₫ trên toàn quốc
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                100% Chính hãng
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Nhập khẩu trực tiếp từ Hàn Quốc có tem phụ
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                Đổi trả trong 7 ngày
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Đổi mới nếu sản phẩm lỗi hoặc kích ứng da
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '800',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={20} color="var(--color-primary)" />
              <span>GlowSeoul</span>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                maxWidth: '320px',
              }}
            >
              Thiên đường mỹ phẩm K-Beauty chuẩn Hàn hàng đầu Việt Nam. Nơi bạn tìm thấy các sản
              phẩm dưỡng da và trang điểm hot nhất từ Seoul.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
              Danh mục
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <li><Link href="/products?category=serum">Serum & Tinh chất</Link></li>
              <li><Link href="/products?category=sunscreen">Kem chống nắng</Link></li>
              <li><Link href="/products?category=toner">Toner nước hoa hồng</Link></li>
              <li><Link href="/products?category=mask">Mặt nạ dưỡng</Link></li>
              <li><Link href="/products?category=makeup">Son & Trang điểm</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
              Loại da
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <li><Link href="/products?skinType=oily">Da dầu & Lỗ chân lông</Link></li>
              <li><Link href="/products?skinType=dry">Da khô thiếu ẩm</Link></li>
              <li><Link href="/products?skinType=sensitive">Da nhạy cảm phục hồi</Link></li>
              <li><Link href="/products?skinType=acne">Da mụn làm dịu</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
              Thương hiệu
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <li><Link href="/products?brand=COSRX">COSRX</Link></li>
              <li><Link href="/products?brand=Beauty+of+Joseon">Beauty of Joseon</Link></li>
              <li><Link href="/products?brand=Laneige">Laneige</Link></li>
              <li><Link href="/products?brand=Skin1004">Skin1004</Link></li>
              <li><Link href="/products?brand=Rom%26nd">Rom&nd</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span>© 2026 GlowSeoul K-Beauty. All rights reserved.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={14} color="var(--color-primary)" fill="var(--color-primary)" /> for K-Beauty Lovers
          </span>
        </div>
      </div>
    </footer>
  );
}
