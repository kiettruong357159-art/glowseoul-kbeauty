import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, Database } from 'lucide-react';

export default function AdminHeader() {
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
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          padding: '0 20px',
        }}
      >
        {/* Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                background: 'var(--color-gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                fontSize: '22px',
                letterSpacing: '-0.5px',
              }}
            >
              GlowSeoul
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                background: '#1e293b',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Admin Portal
            </span>
          </Link>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <Database size={13} />
            <span>SQLite Master Data Connected</span>
          </div>
        </div>

        {/* Right Action: Storefront link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            className="btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              background: 'white',
            }}
          >
            <ArrowLeft size={16} />
            <span>Về cửa hàng</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
