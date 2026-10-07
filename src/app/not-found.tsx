import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-gradient-brand)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <Sparkles size={32} />
      </div>
      <h1
        style={{
          fontSize: '48px',
          fontWeight: '900',
          color: 'var(--color-primary)',
          marginBottom: '8px',
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
        Không tìm thấy trang yêu cầu
      </h2>
      <p
        style={{
          color: 'var(--color-text-muted)',
          maxWidth: '420px',
          marginBottom: '24px',
          fontSize: '14px',
        }}
      >
        Trang bạn đang tìm kiếm có thể đã được thay đổi đường dẫn hoặc tạm thời không khả dụng.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary)',
          color: 'white',
          fontWeight: '700',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} />
        <span>Quay về trang chủ GlowSeoul</span>
      </Link>
    </div>
  );
}
