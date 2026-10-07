'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Filter,
  X
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

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

export default function ReviewManager() {
  const { showSuccess, showError } = useToast();

  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    fetchReviews();
  }, [fetchReviews]);

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
      } else {
        showError(data.error || 'Xóa đánh giá thất bại');
      }
    } catch {
      showError('Có lỗi xảy ra khi xóa đánh giá');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Controls */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
              <Sparkles size={15} /> Kiểm duyệt nội dung
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0 0' }}>
              Quản Lý Đánh Giá Khách Hàng
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-bg-subtle, #fdf8f7)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--color-primary)',
            }}
          >
            <MessageSquare size={16} />
            <span>Tổng cộng: <strong>{total}</strong> nhận xét</span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-subtle)',
              }}
            />
            <input
              type="text"
              placeholder="Tìm theo tên khách, sản phẩm hoặc từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="var(--color-text-muted)" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                background: 'white',
              }}
            >
              <option value="">Tất cả số sao</option>
              <option value="5">5 sao (Xuất sắc)</option>
              <option value="4">4 sao (Tốt)</option>
              <option value="3">3 sao (Bình thường)</option>
              <option value="2">2 sao (Chưa hài lòng)</option>
              <option value="1">1 sao (Kém)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Đang tải danh sách đánh giá...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <MessageSquare size={36} style={{ margin: '0 auto 12px', color: '#d1d5db' }} />
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
              Không tìm thấy đánh giá nào
            </div>
            <div style={{ fontSize: '13px' }}>
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc số sao.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)', width: '220px' }}>
                    Sản phẩm
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)', width: '160px' }}>
                    Khách hàng
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)', width: '120px' }}>
                    Đánh giá
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                    Nhận xét & Trải nghiệm
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)', width: '110px' }}>
                    Ngày gửi
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--color-text-muted)', width: '80px', textAlign: 'center' }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr
                    key={rev.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Product */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '11px', textTransform: 'uppercase' }}>
                        {rev.product?.brand || 'K-Beauty'}
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)', marginTop: '2px', lineHeight: '1.4' }}>
                        {rev.product?.name || 'Sản phẩm'}
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
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
                    <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= rev.rating ? '#f59e0b' : 'none'}
                            color={s <= rev.rating ? '#f59e0b' : '#d1d5db'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309' }}>
                        {rev.rating}/5 sao
                      </span>
                    </td>

                    {/* Comment */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                      {rev.title && (
                        <div style={{ fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '3px' }}>
                          {rev.title}
                        </div>
                      )}
                      <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        {rev.comment}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'top', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        onClick={() => setDeleteTarget(rev)}
                        title="Xóa đánh giá này"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #fee2e2',
                          background: '#fff5f5',
                          color: '#ef4444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
