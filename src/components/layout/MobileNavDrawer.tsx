'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, ChevronRight, ShieldCheck, Phone, Heart } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LINKS = [
  { label: 'Tất cả sản phẩm', href: '/products', badge: 'HOT' },
  { label: 'Serum & Tinh chất', href: '/products?category=serum', badge: null },
  { label: 'Kem chống nắng', href: '/products?category=sunscreen', badge: 'MÙA HÈ' },
  { label: 'Toner cân bằng', href: '/products?category=toner', badge: null },
  { label: 'Mặt nạ dưỡng', href: '/products?category=mask', badge: null },
  { label: 'Sữa rửa mặt', href: '/products?category=cleanser', badge: null },
  { label: 'Son & Trang điểm', href: '/products?category=makeup', badge: 'TRENDY' },
];

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: 'min(320px, 85vw)',
          height: '100%',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse',
          overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Sparkles size={16} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800' }}>
              Glow<span style={{ color: 'var(--color-primary)' }}>Seoul</span>
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--color-text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{ padding: '16px 0', flex: 1 }}>
          <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Danh mục khám phá
          </div>

          <Link
            href="/"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-main)',
              borderLeft: '3px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <span>Trang chủ</span>
            <ChevronRight size={16} color="var(--color-text-subtle)" />
          </Link>

          {CATEGORY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-main)',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </span>
              <ChevronRight size={16} color="var(--color-text-subtle)" />
            </Link>
          ))}
        </div>

        {/* Drawer Footer Information */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>100% Mỹ phẩm Hàn Quốc chính hãng</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <Phone size={16} color="var(--color-primary)" />
            <span>Hotline hỗ trợ: <strong>1900 6868</strong></span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '6px' }}>
            Made with <Heart size={10} style={{ display: 'inline', color: 'var(--color-primary)' }} /> for K-Beauty Lovers
          </div>
        </div>
      </div>
    </div>
  );
}
