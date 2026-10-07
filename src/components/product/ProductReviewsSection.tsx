'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, Sparkles, Filter, X, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  authorName: string;
  authorEmail?: string | null;
  skinType?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string | Date;
}

interface ReviewStats {
  total: number;
  average: number;
  counts: Record<number, number>;
}

interface ProductReviewsSectionProps {
  productId: string;
  initialRating?: number;
  initialCount?: number;
}

const SKIN_TYPE_LABELS: Record<string, string> = {
  all: 'Mọi loại da',
  oily: 'Da dầu / mụn',
  dry: 'Da khô / thiếu ẩm',
  combination: 'Da hỗn hợp',
  sensitive: 'Da nhạy cảm',
  normal: 'Da thường',
};

export default function ProductReviewsSection({
  productId,
  initialRating = 5.0,
  initialCount = 0,
}: ProductReviewsSectionProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: initialCount,
    average: initialRating,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: initialCount },
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSkinType, setFilterSkinType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState(user?.name || '');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formSkinType, setFormSkinType] = useState('combination');

  // Sync user name when user logs in
  useEffect(() => {
    if (user?.name && !formName) {
      setFormName(user.name);
    }
  }, [user, formName]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== null && r.rating !== filterRating) {
      return false;
    }
    if (filterSkinType !== 'all' && r.skinType !== filterSkinType) {
      return false;
    }
    return true;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      showError('Vui lòng nhập tên của bạn và nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: formRating,
          title: formTitle.trim() || null,
          comment: formComment.trim(),
          authorName: formName.trim(),
          skinType: formSkinType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Gửi đánh giá thất bại');
        return;
      }

      showSuccess('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
      setIsModalOpen(false);
      setFormTitle('');
      setFormComment('');
      fetchReviews();
    } catch {
      showError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="product-reviews-section"
      style={{
        marginTop: '64px',
        padding: '36px',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
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
          marginBottom: '32px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            <Sparkles size={16} /> Đánh Giá Từ Khách Hàng Thực Tế
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.3px' }}>
            Trải Nghiệm & Cảm Nhận K-Beauty
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            fontSize: '14px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <MessageSquarePlus size={16} />
          <span>Viết đánh giá của bạn</span>
        </button>
      </div>

      {/* Scorecard Summary Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 260px) 1fr',
          gap: '32px',
          padding: '28px',
          background: 'var(--color-bg-subtle, #fdf8f7)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          alignItems: 'center',
        }}
        className="responsive-grid-1"
      >
        {/* Left: Overall Big Score */}
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--color-border-subtle)', paddingRight: '20px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--color-primary)', lineHeight: 1 }}>
            {stats.average.toFixed(1)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '10px 0 6px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                fill={star <= Math.round(stats.average) ? '#f59e0b' : 'none'}
                color={star <= Math.round(stats.average) ? '#f59e0b' : '#d1d5db'}
              />
            ))}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Dựa trên <strong>{stats.total}</strong> lượt đánh giá
          </div>
        </div>

        {/* Right: Star Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts?.[star] || 0;
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <span style={{ width: '45px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  {star} sao
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'var(--color-primary)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span style={{ width: '32px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} /> Lọc theo:
        </span>

        {/* Rating filters */}
        <button
          onClick={() => setFilterRating(null)}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: filterRating === null ? 'var(--color-primary)' : 'var(--color-border)',
            background: filterRating === null ? 'var(--color-primary)' : 'white',
            color: filterRating === null ? 'white' : 'var(--color-text-main)',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Tất cả số sao
        </button>

        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            onClick={() => setFilterRating(filterRating === s ? null : s)}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterRating === s ? 'var(--color-primary)' : 'var(--color-border)',
              background: filterRating === s ? 'var(--color-primary)' : 'white',
              color: filterRating === s ? 'white' : 'var(--color-text-main)',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {s} sao
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 6px' }} />

        {/* Skin type filter */}
        <select
          value={filterSkinType}
          onChange={(e) => setFilterSkinType(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'white',
            color: 'var(--color-text-main)',
            fontWeight: '500',
          }}
        >
          <option value="all">Mọi loại da</option>
          <option value="oily">Da dầu / mụn</option>
          <option value="dry">Da khô / thiếu ẩm</option>
          <option value="combination">Da hỗn hợp</option>
          <option value="sensitive">Da nhạy cảm</option>
          <option value="normal">Da thường</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Đang tải đánh giá sản phẩm...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '15px', marginBottom: '12px' }}>Chưa có đánh giá nào phù hợp với bộ lọc.</p>
          <button
            onClick={() => { setFilterRating(null); setFilterSkinType('all'); }}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                background: '#fafafa',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-primary-light, #fce7f3)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                    }}
                  >
                    {rev.authorName ? rev.authorName.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>{rev.authorName}</span>
                      {rev.isVerifiedPurchase && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            color: '#10b981',
                            fontWeight: '600',
                            background: '#ecfdf5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          <CheckCircle2 size={12} /> Đã mua hàng
                        </span>
                      )}
                    </div>
                    {rev.skinType && rev.skinType !== 'all' && (
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Loại da: <strong>{SKIN_TYPE_LABELS[rev.skinType] || rev.skinType}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>
                  {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= rev.rating ? '#f59e0b' : 'none'}
                    color={s <= rev.rating ? '#f59e0b' : '#d1d5db'}
                  />
                ))}
              </div>

              {/* Review Content */}
              {rev.title && (
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                  {rev.title}
                </h4>
              )}
              <p style={{ fontSize: '14px', color: 'var(--color-text-main)', lineHeight: '1.6', margin: 0 }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
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
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              Viết Đánh Giá Sản Phẩm
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Chia sẻ cảm nhận chân thực để cộng đồng yêu thích K-Beauty chọn được routine phù hợp nhất.
            </p>

            <form onSubmit={handleSubmitReview}>
              {/* Star Rating Select */}
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                  Đánh giá tổng quan *
                </label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (formHoverRating || formRating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transition: 'transform 0.15s ease',
                          transform: active ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        <Star
                          size={32}
                          fill={active ? '#f59e0b' : 'none'}
                          color={active ? '#f59e0b' : '#d1d5db'}
                        />
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', marginTop: '6px' }}>
                  {formRating === 5 && 'Tuyệt vời, cực kỳ hài lòng!'}
                  {formRating === 4 && 'Rất tốt, hợp với da mình'}
                  {formRating === 3 && 'Tạm ổn, cần trải nghiệm thêm'}
                  {formRating === 2 && 'Chưa thực sự hiệu quả'}
                  {formRating === 1 && 'Không phù hợp với da mình'}
                </div>
              </div>

              {/* Author Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Họ và tên của bạn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Linh Chi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Skin Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Tình trạng da của bạn
                </label>
                <select
                  value={formSkinType}
                  onChange={(e) => setFormSkinType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    background: 'white',
                  }}
                >
                  <option value="oily">Da dầu / lỗ chân lông to</option>
                  <option value="dry">Da khô / dễ bong tróc</option>
                  <option value="combination">Da hỗn hợp thiên dầu / thiên khô</option>
                  <option value="sensitive">Da nhạy cảm, dễ ửng đỏ</option>
                  <option value="normal">Da thường / khỏe mạnh</option>
                  <option value="all">Khác</option>
                </select>
              </div>

              {/* Review Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Tiêu đề đánh giá
                </label>
                <input
                  type="text"
                  placeholder="Tóm tắt ngắn gọn cảm nhận của bạn"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Review Body */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Nội dung đánh giá chi tiết *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả kết cấu, mùi hương, khả năng thẩm thấu và hiệu quả sau thời gian sử dụng..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
