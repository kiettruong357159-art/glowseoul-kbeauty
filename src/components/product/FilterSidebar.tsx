'use client';

import React from 'react';
import { Filter, RotateCcw, Loader2 } from 'lucide-react';
import { useCatalogFilter } from '@/context/CatalogFilterContext';

const CATEGORIES = [
  { label: 'Tất cả danh mục', value: '' },
  { label: 'Serum & Tinh chất', value: 'serum' },
  { label: 'Kem chống nắng', value: 'sunscreen' },
  { label: 'Toner nước hoa hồng', value: 'toner' },
  { label: 'Mặt nạ dưỡng', value: 'mask' },
  { label: 'Sữa rửa mặt', value: 'cleanser' },
  { label: 'Son & Trang điểm', value: 'makeup' },
];

const SKIN_TYPES = [
  { label: 'Mọi loại da', value: '' },
  { label: 'Da dầu & Lỗ chân lông', value: 'oily' },
  { label: 'Da khô thiếu nước', value: 'dry' },
  { label: 'Da nhạy cảm phục hồi', value: 'sensitive' },
  { label: 'Da mụn làm dịu', value: 'acne' },
];

const BRANDS = [
  'COSRX',
  'Beauty of Joseon',
  'Laneige',
  'Skin1004',
  'Torriden',
  'Anua',
  'Rom&nd',
  'Innisfree',
  'Round Lab',
  'Some By Mi',
];

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: '', max: '' },
  { label: 'Dưới 200.000₫', min: '', max: '200000' },
  { label: '200.000₫ - 400.000₫', min: '200000', max: '400000' },
  { label: 'Trên 400.000₫', min: '400000', max: '' },
];

export default function FilterSidebar() {
  const { isPending, filters, setFilter, setPriceRange, resetFilters } = useCatalogFilter();

  const currentCategory = filters.category;
  const currentSkinType = filters.skinType;
  const currentBrand = filters.brand;
  const currentMinPrice = filters.minPrice;
  const currentMaxPrice = filters.maxPrice;

  return (
    <aside
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: '90px',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800' }}>
          <Filter size={18} color="var(--color-primary)" />
          <span>Bộ Lọc</span>
          {isPending && (
            <Loader2
              size={14}
              style={{
                animation: 'spin 0.8s linear infinite',
                color: 'var(--color-primary)',
                marginLeft: '4px',
              }}
            />
          )}
        </div>
        <button
          onClick={resetFilters}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 0.15s ease',
          }}
          title="Đặt lại tất cả bộ lọc"
        >
          <RotateCcw size={12} />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
          Danh mục
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: currentCategory === cat.value ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: currentCategory === cat.value ? '700' : '500',
                transition: 'color 0.15s ease',
              }}
            >
              <input
                type="radio"
                name="category"
                checked={currentCategory === cat.value}
                onChange={() => setFilter('category', cat.value)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skin Type Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
          Loại da
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SKIN_TYPES.map((st) => (
            <label
              key={st.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: currentSkinType === st.value ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: currentSkinType === st.value ? '700' : '500',
                transition: 'color 0.15s ease',
              }}
            >
              <input
                type="radio"
                name="skinType"
                checked={currentSkinType === st.value}
                onChange={() => setFilter('skinType', st.value)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span>{st.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
          Thương hiệu
        </h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {BRANDS.map((brand) => (
            <label
              key={brand}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: currentBrand === brand ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: currentBrand === brand ? '700' : '500',
                transition: 'color 0.15s ease',
              }}
            >
              <input
                type="checkbox"
                checked={currentBrand === brand}
                onChange={() => setFilter('brand', currentBrand === brand ? '' : brand)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
          Mức giá
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRICE_RANGES.map((range, idx) => {
            const isSelected = currentMinPrice === range.min && currentMaxPrice === range.max;
            return (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: isSelected ? '700' : '500',
                  transition: 'color 0.15s ease',
                }}
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => setPriceRange(range.min, range.max)}
                  style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
