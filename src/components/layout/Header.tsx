'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Search, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import MobileNavDrawer from './MobileNavDrawer';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="show-on-mobile"
              style={{
                padding: '6px',
                color: 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Mở menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--color-gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: 'var(--shadow-md)',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} />
              </div>
              <span>
                Glow<span style={{ color: 'var(--color-primary)' }}>Seoul</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop Only */}
          <nav
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            <Link href="/" style={{ transition: 'color 0.2s ease' }}>
              Trang chủ
            </Link>
            <Link href="/products" style={{ transition: 'color 0.2s ease' }}>
              Tất cả sản phẩm
            </Link>
            <Link href="/products?category=serum" style={{ transition: 'color 0.2s ease' }}>
              Serum & Ampoule
            </Link>
            <Link href="/products?category=sunscreen" style={{ transition: 'color 0.2s ease' }}>
              Kem chống nắng
            </Link>
            <Link href="/products?category=mask" style={{ transition: 'color 0.2s ease' }}>
              Mặt nạ
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/products"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)',
                color: 'var(--color-text-main)',
                transition: 'all 0.2s',
              }}
              title="Tìm kiếm sản phẩm"
            >
              <Search size={18} />
            </Link>

            {/* Cart Icon Button with Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              title="Xem giỏ hàng"
            >
              <ShoppingBag size={18} />
              <span className="hide-on-mobile">Giỏ hàng</span>
              {totalItems > 0 && (
                <span
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
