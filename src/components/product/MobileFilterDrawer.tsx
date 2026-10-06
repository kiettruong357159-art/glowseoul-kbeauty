'use client';

import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { useCatalogFilter } from '@/context/CatalogFilterContext';
import FilterSidebar from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
  const { filters, resetFilters } = useCatalogFilter();

  if (!isOpen) return null;

  const activeCount = [
    filters.category,
    filters.skinType,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer Container (Slide-in from right / bottom) */}
      <div
        style={{
          position: 'relative',
          width: 'min(360px, 90vw)',
          height: '100%',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '16px' }}>
            <Filter size={18} color="var(--color-primary)" />
            <span>Bộ Lọc Sản Phẩm</span>
            {activeCount > 0 && (
              <span
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                {activeCount}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  fontWeight: '600',
                  padding: '4px 8px',
                }}
              >
                <RotateCcw size={12} />
                <span>Đặt lại</span>
              </button>
            )}
            <button
              onClick={onClose}
              type="button"
              style={{
                padding: '6px',
                color: 'var(--color-text-subtle)',
                borderRadius: '50%',
              }}
              title="Đóng bộ lọc"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <FilterSidebar isMobileDrawer />
        </div>

        {/* Sticky Apply Button */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--color-border)',
            background: 'white',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <button
            onClick={onClose}
            type="button"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <Check size={18} />
            <span>Áp dụng bộ lọc ({activeCount > 0 ? `${activeCount} tiêu chí` : 'Tất cả'})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
