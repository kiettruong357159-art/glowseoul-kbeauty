'use client';

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  brands,
}: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [skinType, setSkinType] = useState('all');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [usage, setUsage] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setBrand(initialData.brand || '');
      setCategory(initialData.category || '');
      setPrice(initialData.price ? String(initialData.price) : '');
      setOriginalPrice(initialData.originalPrice ? String(initialData.originalPrice) : '');
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '50');
      setSkinType(initialData.skinType || 'all');
      setIngredients(initialData.ingredients || '');
      setDescription(initialData.description || '');
      setUsage(initialData.usage || '');
      setIsBestSeller(Boolean(initialData.isBestSeller));
      setIsNew(Boolean(initialData.isNew));

      let img = '';
      try {
        const parsed = JSON.parse(initialData.images);
        img = Array.isArray(parsed) ? parsed[0] : initialData.images;
      } catch {
        img = initialData.images || '';
      }
      setImageUrl(img);
    } else {
      // Defaults for create mode
      setName('');
      setBrand(brands[0]?.name || 'COSRX');
      setCategory(categories[0]?.slug || 'serum');
      setPrice('');
      setOriginalPrice('');
      setStock('50');
      setSkinType('all');
      setImageUrl('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
      setIngredients('Dịch nhầy ốc sên, Niacinamide, Hyaluronic Acid...');
      setDescription('Dưỡng chất cấp ẩm sâu, phục hồi và nuôi dưỡng làn da sáng khỏe chuẩn Hàn.');
      setUsage('Sử dụng mỗi sáng và tối sau bước toner.');
      setIsBestSeller(false);
      setIsNew(true);
    }
    setError('');
  }, [initialData, isOpen, categories, brands]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Vui lòng nhập giá bán hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: initialData?.id,
        name: name.trim(),
        brand: brand.trim(),
        category: category.trim(),
        price: Math.round(Number(price)),
        originalPrice: originalPrice ? Math.round(Number(originalPrice)) : null,
        stock: Math.max(0, Math.round(Number(stock))),
        skinType,
        images: [imageUrl.trim()],
        ingredients: ingredients.trim(),
        description: description.trim(),
        usage: usage.trim(),
        isBestSeller,
        isNew,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)' }}>
              {initialData ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mỹ phẩm mới'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Cập nhật thông tin chi tiết, giá thành và quản lý tồn kho trực tiếp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: '#fef2f2',
                color: '#ef4444',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Tên sản phẩm <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Kem Chống Nắng Lúa Mạch Beauty of Joseon Relief Sun 50ml"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 2: Brand & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Thương hiệu <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Danh mục <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Price, Original Price, Stock, Skin Type */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Giá bán (VNĐ) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="285000"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Giá gốc (gạch ngang)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="380000"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Số lượng tồn kho
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                Loại da phù hợp
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="all">Mọi loại da</option>
                <option value="sensitive">Da nhạy cảm</option>
                <option value="dry">Da khô / thiếu ẩm</option>
                <option value="oily">Da dầu / mụn</option>
                <option value="acne">Da mụn sưng đỏ</option>
              </select>
            </div>
          </div>

          {/* Row 4: Image URL with Live Preview */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Link hình ảnh sản phẩm (Unsplash URL) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />

              {/* Live Preview Box */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'var(--color-bg)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon size={22} color="var(--color-text-muted)" />
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Descriptions */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Mô tả sản phẩm
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu công dụng và đặc điểm nổi bật..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Row 6: Badges & Features */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span>Đánh dấu "Bán chạy" (Best Seller)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span>Đánh dấu "Sản phẩm mới" (New Arrival)</span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '10px 20px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                borderRadius: 'var(--radius-md)',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Đang lưu...' : initialData ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
