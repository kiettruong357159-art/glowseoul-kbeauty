'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Search, Menu, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import MobileNavDrawer from './MobileNavDrawer';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
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

            {/* User Account / Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                  <Link
                    href="/admin"
                    className="hide-on-mobile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#4f46e5',
                      background: '#e0e7ff',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    title="Đi đến trang Quản trị"
                  >
                    <Shield size={13} />
                    <span>Quản trị</span>
                  </Link>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--color-bg)',
                    padding: '4px 10px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--color-gradient-brand)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span
                    className="hide-on-mobile"
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      maxWidth: '90px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    title="Đăng xuất"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3px',
                      borderRadius: '50%',
                      color: 'var(--color-text-subtle)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-main)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                title="Đăng nhập tài khoản"
              >
                <UserIcon size={15} color="var(--color-primary)" />
                <span className="hide-on-mobile">Đăng nhập</span>
              </Link>
            )}

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
