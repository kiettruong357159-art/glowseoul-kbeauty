'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
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
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <span>
            Glow<span style={{ color: 'var(--color-primary)' }}>Seoul</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/products"
            style={{
              width: '40px',
              height: '40px',
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
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={18} />
            <span>Giỏ hàng</span>
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
  );
}
