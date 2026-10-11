'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChevronRight, LogOut, User as UserIcon, RefreshCw, ChevronDown, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  currentTabTitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({
  onMenuClick,
  currentTabTitle = 'Bảng điều khiển',
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showSuccess } = useToast();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.admin-user-dropdown-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

        {/* Right Section: Refresh + User Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Quick Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Đồng bộ và làm mới dữ liệu mới nhất từ hệ thống"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: isRefreshing ? 'var(--color-bg)' : 'white',
                color: 'var(--color-text-main)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw
                size={13}
                style={{
                  color: isRefreshing ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              />
              <span className="desktop-only">{isRefreshing ? 'Đang đồng bộ...' : 'Làm mới'}</span>
            </button>
          )}

          {/* User Profile Dropdown (Consolidated: Profile + Storefront + Logout) */}
          {user && (
            <div className="admin-user-dropdown-container" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  background: isUserMenuOpen ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  border: isUserMenuOpen ? '1px solid rgba(255, 107, 129, 0.4)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--color-text-main)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Menu tài khoản quản trị"
                aria-expanded={isUserMenuOpen}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--color-gradient-brand)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      boxShadow: '0 2px 6px rgba(255, 107, 129, 0.3)',
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span
                    style={{
                      fontSize: '13px',
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

                <ChevronDown
                  size={14}
                  style={{
                    color: 'var(--color-text-muted)',
                    transition: 'transform 0.2s ease',
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Dropdown Menu Card */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: '240px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(240, 234, 230, 0.95)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 60,
                  }}
                >
                  {/* User Profile Header Info */}
                  <div
                    style={{
                      padding: '10px 12px',
                      background: 'var(--color-surface-hover)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--color-gradient-brand)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--color-text-main)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: user.role === 'ADMIN' ? '#7e22ce' : '#1d4ed8',
                          background: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          marginTop: '3px',
                        }}
                      >
                        {user.role === 'ADMIN' ? 'Quản trị viên cấp cao' : 'Nhân viên quản trị'}
                      </span>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />

                  {/* Return to Storefront link */}
                  <Link
                    href="/"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      color: 'var(--color-text-main)',
                      fontWeight: '600',
                      fontSize: '13px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Store size={16} color="var(--color-primary)" />
                    <div>
                      <div>Về cửa hàng</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: '400' }}>
                        Xem giao diện mua sắm khách hàng
                      </div>
                    </div>
                  </Link>

                  {/* Account profile link */}
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      color: 'var(--color-text-main)',
                      fontWeight: '600',
                      fontSize: '13px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <UserIcon size={16} color="var(--color-text-muted)" />
                    <div>
                      <div>Hồ sơ cá nhân</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: '400' }}>
                        Cập nhật mật khẩu & thông tin
                      </div>
                    </div>
                  </Link>

                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      color: '#ef4444',
                      fontWeight: '600',
                      fontSize: '13px',
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <LogOut size={16} color="#ef4444" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

