'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function LiveSearch({ initialValue = '' }: { initialValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/products');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/products');
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 16px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
        }}
      >
        <Search size={18} color="var(--color-primary)" style={{ marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên sản phẩm, thương hiệu hoặc thành phần (Ốc sên, Rau má...)"
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            background: 'transparent',
            padding: '8px 0',
            fontFamily: 'inherit',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{ color: 'var(--color-text-subtle)', padding: '4px' }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
