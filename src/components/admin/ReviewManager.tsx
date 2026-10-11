'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';
import AdminTableSkeleton from '@/components/ui/skeletons/AdminTableSkeleton';
import { getProductImageUrl, DEFAULT_PRODUCT_IMAGE } from '@/lib/image-fallback';

interface AdminReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  authorName: string;
  authorEmail?: string | null;
  skinType?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    brand: string;
    image?: string;
  };
}

interface ReviewManagerProps {
  initialReviews?: AdminReviewItem[];
  onRefreshCounts?: () => void;
}

export default function ReviewManager({ initialReviews, onRefreshCounts }: ReviewManagerProps = {}) {
  const { showSuccess, showError } = useToast();

  const [reviews, setReviews] = useState<AdminReviewItem[]>(initialReviews || []);
  const [, setTotal] = useState(initialReviews ? initialReviews.length : 0);
  const [loading, setLoading] = useState(!initialReviews || initialReviews.length === 0);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const hasInitialized = React.useRef(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (selectedRating) params.set('rating', selectedRating);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
      } else {
        showError('Không thể tải danh sách đánh giá');
      }
    } catch {
      showError('Lỗi kết nối khi tải đánh giá');
    } finally {
      setLoading(false);
    }
  }, [search, selectedRating, showError]);

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0 && !hasInitialized.current && !search && !selectedRating) {
      setReviews(initialReviews);
      setTotal(initialReviews.length);
      setLoading(false);
      hasInitialized.current = true;
      return;
    }
    fetchReviews();
  }, [fetchReviews, initialReviews, search, selectedRating]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message || 'Đã xóa đánh giá thành công');
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setTotal((prev) => Math.max(0, prev - 1));
        setDeleteTarget(null);
        onRefreshCounts?.();
      } else {
        showError(data.error || 'Xóa đánh giá thất bại');
      }
    } catch {
      showError('Có lỗi xảy ra khi xóa đánh giá');
    } finally {
      setDeleting(false);
    }
  };

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRating, verifiedFilter]);

  const filteredReviews = reviews.filter((rev) => {
    if (verifiedFilter === 'verified' && !rev.isVerifiedPurchase) return false;
    if (verifiedFilter === 'unverified' && rev.isVerifiedPurchase) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return <AdminTableSkeleton rows={6} />;
  }

  return (
    <div>
      {/* Control bar: search, rating filter, verified purchase filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: '200px',
              maxWidth: '360px',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Tìm theo khách hàng, sản phẩm hoặc từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
                background: 'var(--color-bg)',
              }}
            />
          </div>

          {/* Rating Filter */}
          <CustomSelect
            value={selectedRating}
            onChange={setSelectedRating}
            placeholder="Tất cả số sao"
            searchPlaceholder="Tìm số sao..."
            options={[
              { value: '', label: 'Tất cả số sao' },
              { value: '5', label: '⭐⭐⭐⭐⭐ 5 sao (Xuất sắc)' },
              { value: '4', label: '⭐⭐⭐⭐ 4 sao (Tốt)' },
              { value: '3', label: '⭐⭐⭐ 3 sao (Bình thường)' },
              { value: '2', label: '⭐⭐ 2 sao (Chưa hài lòng)' },
              { value: '1', label: '⭐ 1 sao (Kém)' },
            ]}
            style={{ minWidth: '190px' }}
          />

          {/* Verified Purchase Filter */}
          <CustomSelect
            value={verifiedFilter}
            onChange={setVerifiedFilter}
            placeholder="Tất cả lượt mua"
            options={[
              { value: '', label: 'Tất cả lượt mua' },
              { value: 'verified', label: '✓ Đã xác thực mua hàng' },
              { value: 'unverified', label: 'Chưa xác thực đơn mua' },
            ]}
            style={{ minWidth: '190px' }}
          />
        </div>

        {/* Count badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--color-text-muted)',
          }}
        >
          <MessageSquare size={15} color="var(--color-primary)" />
          <span>Tổng cộng: <strong style={{ color: 'var(--color-text-main)' }}>{filteredReviews.length}</strong> nhận xét</span>
        </div>
      </div>

      {/* Reviews Table - Quản Lý Đánh Giá Khách Hàng */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto',
          background: 'white',
        }}
      >
        <table aria-label="Quản Lý Đánh Giá Khách Hàng" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '260px' }}>Sản phẩm</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '180px' }}>Khách hàng</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '120px' }}>Đánh giá</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Nhận xét & Trải nghiệm</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '110px' }}>Ngày gửi</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '80px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy đánh giá nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc số sao.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedReviews.map((rev) => {
                const imgUrl = getProductImageUrl(rev.product?.image);
                return (
                  <tr
                    key={rev.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    {/* Product matching ProductListTable */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={rev.product?.name || 'Sản phẩm'}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ minWidth: 0, maxWidth: '200px' }}>
                          <div
                            style={{
                              fontWeight: '700',
                              color: 'var(--color-text-main)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={rev.product?.name}
                          >
                            {rev.product?.name || 'Sản phẩm'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: 'var(--color-primary)',
                                background: 'var(--color-primary-light)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {rev.product?.brand || 'K-Beauty'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>
                        {rev.authorName}
                      </div>
                      {rev.isVerifiedPurchase && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#15803d',
                            fontSize: '11px',
                            fontWeight: '600',
                            marginTop: '2px',
                          }}
                        >
                          <CheckCircle2 size={12} /> Đã mua hàng
                        </div>
                      )}
                      {rev.skinType && rev.skinType !== 'all' && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                          Da: {rev.skinType}
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            fill={s <= rev.rating ? '#f59e0b' : 'none'}
                            color={s <= rev.rating ? '#f59e0b' : '#d1d5db'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#b45309' }}>
                        {rev.rating}/5 sao
                      </span>
                    </td>

                    {/* Comment */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {rev.title && (
                        <div style={{ fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                          {rev.title}
                        </div>
                      )}
                      <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.4', maxWidth: '360px' }}>
                        {rev.comment}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap', color: 'var(--color-text-subtle)' }}>
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(rev)}
                        title="Xóa đánh giá này"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredReviews.length}
          pageSize={pageSize}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
              Xác Nhận Xóa Đánh Giá?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: '1.5', marginBottom: '20px' }}>
              Bạn có chắc chắn muốn xóa nhận xét của <strong>{deleteTarget.authorName}</strong> cho sản phẩm <strong>{deleteTarget.product?.name}</strong>? Điểm đánh giá trung bình của sản phẩm sẽ được tự động tính toán lại.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                style={{
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
