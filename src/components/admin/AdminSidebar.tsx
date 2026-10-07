'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Ticket,
  Megaphone,
  ArrowLeft,
  Database,
  Sparkles,
  X,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'orders' | 'products' | 'taxonomies' | 'coupons' | 'banners';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  counts: {
    orders: number;
    products: number;
    categories: number;
    brands: number;
    coupons: number;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  counts,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const navSections = [
    {
      title: 'BÁO CÁO & KINH DOANH',
      items: [
        { id: 'dashboard' as const, label: 'Tổng quan', icon: LayoutDashboard },
        { id: 'orders' as const, label: 'Đơn hàng', icon: ShoppingBag, count: counts.orders },
      ],
    },
    {
      title: 'QUẢN TRỊ DỮ LIỆU',
      items: [
        { id: 'products' as const, label: 'Sản phẩm', icon: Package, count: counts.products },
        {
          id: 'taxonomies' as const,
          label: 'Danh mục & Hiệu',
          icon: Layers,
          count: counts.categories + counts.brands,
        },
        { id: 'coupons' as const, label: 'Mã giảm giá', icon: Ticket, count: counts.coupons },
        { id: 'banners' as const, label: 'Banners & Khuyến mãi', icon: Megaphone },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 95,
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.3s ease',
        }}
        className={`admin-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Brand & Logo Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--color-gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 10px rgba(255, 107, 129, 0.3)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: '900',
                  fontSize: '18px',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                  background: 'var(--color-gradient-brand)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GlowSeoul
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: '#64748b',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}
              >
                Admin Portal
              </div>
            </div>
          </Link>

          {/* Close button on mobile & tablet */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="admin-sidebar-close-btn"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Đóng menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Vertical Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.8px',
                  padding: '0 12px 8px',
                }}
              >
                {section.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        if (onClose) onClose();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '600',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        background: isActive
                          ? 'var(--color-gradient-brand)'
                          : 'transparent',
                        color: isActive ? 'white' : 'var(--color-text-main)',
                        boxShadow: isActive ? '0 4px 12px rgba(255, 107, 129, 0.25)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-main)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>

                      {item.count !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: isActive
                              ? 'rgba(255, 255, 255, 0.25)'
                              : 'var(--color-bg)',
                            color: isActive ? 'white' : 'var(--color-text-muted)',
                          }}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '16px 14px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#fafafa',
          }}
        >
          {/* SQLite DB Connection Status */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#059669',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              fontWeight: '700',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <Database size={13} />
            <span>SQLite Master Data Connected</span>
          </div>

          {/* Link back to storefront */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              background: 'white',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            <span>Về cửa hàng</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
