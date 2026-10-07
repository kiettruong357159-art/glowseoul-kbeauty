'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 8, 10, 20],
}: PaginationProps) {
  if (totalItems === 0) return null;

  const validTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), validTotalPages);

  const startItem = Math.min((safeCurrentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (validTotalPages <= 7) {
      for (let i = 1; i <= validTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(validTotalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (safeCurrentPage < validTotalPages - 2) pages.push('...');
      if (!pages.includes(validTotalPages)) pages.push(validTotalPages);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 4px 4px',
        marginTop: '16px',
        borderTop: '1px solid var(--color-border)',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Summary info & Page size switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
        <span>
          Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trên tổng số <strong>{totalItems}</strong> bản ghi
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px' }}>/ Trang:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'white',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Previous Button */}
        <button
          type="button"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: safeCurrentPage <= 1 ? '#f8fafc' : 'white',
            color: safeCurrentPage <= 1 ? '#cbd5e1' : 'var(--color-text-main)',
            cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          <ChevronLeft size={14} />
          <span>Trước</span>
        </button>

        {/* Page Number Chips */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '6px 8px',
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === safeCurrentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 6px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? 'none' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-gradient-brand)' : 'white',
                color: isActive ? 'white' : 'var(--color-text-main)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 2px 8px rgba(255, 107, 129, 0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={safeCurrentPage >= validTotalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: safeCurrentPage >= validTotalPages ? '#f8fafc' : 'white',
            color: safeCurrentPage >= validTotalPages ? '#cbd5e1' : 'var(--color-text-main)',
            cursor: safeCurrentPage >= validTotalPages ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          <span>Sau</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
