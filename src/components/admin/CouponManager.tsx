'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Copy, Check, AlertCircle, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import Pagination from '@/components/ui/Pagination';

interface CouponItem {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  isActive: boolean;
  expiresAt?: string | null;
}

interface CouponManagerProps {
  coupons: CouponItem[];
  onRefresh: () => Promise<void>;
}

export default function CouponManager({ coupons, onRefresh }: CouponManagerProps) {
  const { showSuccess, showError, showInfo } = useToast();
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Search, Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    showInfo(`Đã sao chép mã "${couponCode}"`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }
    const percent = Number(discountPercent);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      setError('Phần trăm giảm giá phải từ 1 đến 100');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountPercent: Math.round(percent),
          minOrderAmount: Math.max(0, Math.round(Number(minOrderAmount) || 0)),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi tạo mã giảm giá');
      }

      const createdCode = code.trim().toUpperCase();
      setCode('');
      setDiscountPercent('10');
      setMinOrderAmount('0');
      showSuccess(`Đã tạo mã giảm giá "${createdCode}" thành công!`);
      await onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo mã giảm giá');
      showError(err?.message || 'Không thể tạo mã giảm giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!confirm(`Bạn có chắc muốn xoá mã voucher "${couponCode}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess(`Đã xoá mã giảm giá "${couponCode}" thành công!`);
        await onRefresh();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá mã giảm giá');
      }
    } catch (err) {
      showError('Lỗi kết nối khi xoá voucher');
    }
  };

  // Filter & Pagination logic
  const filteredCoupons = coupons.filter((c) => {
    if (statusFilter === 'active' && !c.isActive) return false;
    if (statusFilter === 'inactive' && c.isActive) return false;
    if (!searchTerm.trim()) return true;
    return c.code.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  const totalPages = Math.ceil(filteredCoupons.length / pageSize) || 1;
  const paginatedCoupons = filteredCoupons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
      {/* Coupons Table List */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
          gridColumn: 'span 2',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={20} color="#10b981" />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              Danh sách mã ưu đãi ({coupons.length})
            </h3>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '180px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã voucher..."
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  fontSize: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  background: 'var(--color-bg)',
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'white',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang kích hoạt</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Mã Voucher</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Mức giảm</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Đơn tối thiểu</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Trạng thái</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Không tìm thấy mã giảm giá phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontWeight: '800',
                            letterSpacing: '0.5px',
                            color: '#059669',
                            background: '#ecfdf5',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px dashed #10b981',
                          }}
                        >
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(c.code)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px' }}
                          title="Sao chép mã"
                        >
                          {copiedCode === c.code ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--color-primary)' }}>
                      Giảm {c.discountPercent}%
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--color-text-main)' }}>
                      {c.minOrderAmount === 0 ? 'Mọi đơn hàng' : `Từ ${formatPrice(c.minOrderAmount)}`}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: c.isActive ? '#ecfdf5' : '#fef2f2',
                          color: c.isActive ? '#059669' : '#ef4444',
                        }}
                      >
                        {c.isActive ? 'Đang kích hoạt' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fee2e2',
                          color: '#ef4444',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        title="Xoá mã voucher"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Coupons Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCoupons.length}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>

      {/* Quick Add Coupon Card */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Plus size={18} color="#10b981" />
          <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Tạo mã giảm giá mới</h3>
        </div>

        {error && (
          <div
            style={{
              fontSize: '12px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Mã voucher <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: KBEAUTY15, SALE50K"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                textTransform: 'uppercase',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Phần trăm giảm (%) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="10"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              placeholder="0 (Áp dụng mọi đơn)"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              padding: '10px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)',
              background: '#10b981',
              marginTop: '4px',
            }}
          >
            {submitting ? 'Đang tạo...' : 'Kích hoạt mã voucher'}
          </button>
        </form>
      </div>
    </div>
  );
}
