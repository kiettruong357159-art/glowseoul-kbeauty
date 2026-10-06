'use client';

import React, { useState } from 'react';
import { Layers, Award, Plus, Trash2, AlertCircle, Check } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  tag?: string | null;
  origin?: string | null;
}

interface TaxonomiesManagerProps {
  categories: CategoryItem[];
  brands: BrandItem[];
  onRefresh: () => Promise<void>;
}

export default function TaxonomiesManager({
  categories,
  brands,
  onRefresh,
}: TaxonomiesManagerProps) {
  // Category form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState('');

  // Brand form state
  const [brandName, setBrandName] = useState('');
  const [brandSlug, setBrandSlug] = useState('');
  const [brandTag, setBrandTag] = useState('');
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [brandError, setBrandError] = useState('');

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    if (!catName.trim() || !catSlug.trim()) {
      setCatError('Vui lòng nhập tên và slug danh mục');
      return;
    }

    setCatSubmitting(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName.trim(),
          slug: catSlug.trim(),
          description: catDesc.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi tạo danh mục');
      }
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      await onRefresh();
    } catch (err: any) {
      setCatError(err?.message || 'Không thể tạo danh mục');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá danh mục "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể xoá danh mục');
      }
    } catch (err) {
      alert('Lỗi kết nối khi xoá danh mục');
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandError('');
    if (!brandName.trim() || !brandSlug.trim()) {
      setBrandError('Vui lòng nhập tên và slug thương hiệu');
      return;
    }

    setBrandSubmitting(true);
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandName.trim(),
          slug: brandSlug.trim(),
          tag: brandTag.trim() || null,
          origin: 'Hàn Quốc',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi tạo thương hiệu');
      }
      setBrandName('');
      setBrandSlug('');
      setBrandTag('');
      await onRefresh();
    } catch (err: any) {
      setBrandError(err?.message || 'Không thể tạo thương hiệu');
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá thương hiệu "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể xoá thương hiệu');
      }
    } catch (err) {
      alert('Lỗi kết nối khi xoá thương hiệu');
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        alignItems: 'flex-start',
      }}
    >
      {/* Column 1: Danh mục sản phẩm */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Layers size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
            Danh mục sản phẩm ({categories.length})
          </h3>
        </div>

        {/* Categories List */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  slug: <code>{c.slug}</code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCategory(c.id, c.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Xoá danh mục"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-main)' }}>
            + Thêm danh mục mới
          </div>

          {catError && (
            <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> {catError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => {
                setCatName(e.target.value);
                if (!catSlug || catSlug === autoSlug(catName)) {
                  setCatSlug(autoSlug(e.target.value));
                }
              }}
              placeholder="Tên danh mục"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              required
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              placeholder="slug-danh-muc"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <input
            type="text"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="Mô tả danh mục ngắn gọn (tùy chọn)"
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={catSubmitting}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
          >
            {catSubmitting ? 'Đang thêm...' : 'Lưu danh mục'}
          </button>
        </form>
      </div>

      {/* Column 2: Thương hiệu đối tác */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={20} color="#8b5cf6" />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
            Thương hiệu Hàn Quốc ({brands.length})
          </h3>
        </div>

        {/* Brands List */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {brands.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>
                    {b.name}
                  </span>
                  {b.tag && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        fontWeight: '700',
                      }}
                    >
                      {b.tag}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  slug: <code>{b.slug}</code> • {b.origin || 'Hàn Quốc'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteBrand(b.id, b.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Xoá thương hiệu"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Brand Form */}
        <form onSubmit={handleAddBrand} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-main)' }}>
            + Thêm thương hiệu mới
          </div>

          {brandError && (
            <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> {brandError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (!brandSlug || brandSlug === autoSlug(brandName)) {
                  setBrandSlug(autoSlug(e.target.value));
                }
              }}
              placeholder="Tên thương hiệu"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              required
              value={brandSlug}
              onChange={(e) => setBrandSlug(e.target.value)}
              placeholder="slug-thuong-hieu"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <input
            type="text"
            value={brandTag}
            onChange={(e) => setBrandTag(e.target.value)}
            placeholder="Tag nhãn hiệu (VD: Dược mỹ phẩm dịu nhẹ)"
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={brandSubmitting}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-md)', background: '#8b5cf6' }}
          >
            {brandSubmitting ? 'Đang thêm...' : 'Lưu thương hiệu'}
          </button>
        </form>
      </div>
    </div>
  );
}
