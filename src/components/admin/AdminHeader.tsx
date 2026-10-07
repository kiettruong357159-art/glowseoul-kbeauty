'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Menu, ChevronRight, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  currentTabTitle?: string;
}

export default function AdminHeader({ onMenuClick, currentTabTitle = 'Bảng điều khiển' }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showSuccess } = useToast();

  const handleLogout = async () => {
    await logout();
    showSuccess('Đã đăng xuất khỏi cổng quản trị');
    router.push('/admin/login');
  };

  return (
    <header
      style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 24px',
          gap: '16px',
        }}
      >
        {/* Left Section: Mobile Menu Button + Mobile Brand OR Desktop Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="admin-menu-btn"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Mở menu điều hướng"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Mobile Brand (only visible < 1024px when sidebar is hidden) */}
          <Link
            href="/admin"
            className="admin-mobile-brand"
            style={{
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                background: 'var(--color-gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                fontSize: '18px',
                letterSpacing: '-0.5px',
              }}
            >
              GlowSeoul
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                background: '#1e293b',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          </Link>

          {/* Desktop Breadcrumb Navigation (visible >= 1024px) */}
          <div
            className="admin-desktop-breadcrumb"
            style={{
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>GlowSeoul</span>
              <span>/</span>
              <span>Quản trị</span>
            </Link>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
              {currentTabTitle}
            </span>
          </div>
        </div>

        {/* Right Section: Database Status + User Profile + Logout + Storefront Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* SQLite Status Pill */}
          <div
            className="hide-on-mobile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#059669',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '700',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <Database size={13} />
            <span>SQLite Connected</span>
          </div>

          {/* User Profile Badge (if logged in) */}
          {user && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 4px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '800',
                  }}
                >
                  <UserIcon size={14} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--color-text-main)',
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name}
                </span>
              </div>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: user.role === 'ADMIN' ? '#7e22ce' : '#1d4ed8',
                  letterSpacing: '0.4px',
                }}
              >
                {user.role}
              </span>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline"
              title="Đăng xuất khỏi Cổng Quản Trị"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: 'var(--radius-md)',
                color: '#ef4444',
                borderColor: '#fee2e2',
                background: '#fff5f5',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              <span className="hide-on-mobile">Đăng xuất</span>
            </button>
          )}

          {/* Link back to storefront */}
          <Link
            href="/"
            className="btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              background: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            <ArrowLeft size={15} />
            <span>Về cửa hàng</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

