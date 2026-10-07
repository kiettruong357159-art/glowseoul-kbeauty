'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Award, Plus, Trash2, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Pagination from '@/components/ui/Pagination';

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
  const { showSuccess, showError } = useToast();

  // Search & Pagination States for Categories
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryPageSize, setCategoryPageSize] = useState(5);

  // Search & Pagination States for Brands
  const [brandSearch, setBrandSearch] = useState('');
  const [brandPage, setBrandPage] = useState(1);
  const [brandPageSize, setBrandPageSize] = useState(5);

  // Reset pagination on search
  useEffect(() => {
    setCategoryPage(1);
  }, [categorySearch]);

  useEffect(() => {
    setBrandPage(1);
  }, [brandSearch]);

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
      const createdName = catName.trim();
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      showSuccess(`Đã tạo danh mục "${createdName}" thành công!`);
      await onRefresh();
    } catch (err: any) {
      setCatError(err?.message || 'Không thể tạo danh mục');
      showError(err?.message || 'Không thể tạo danh mục');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá danh mục "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess(`Đã xoá danh mục "${name}" thành công!`);
        await onRefresh();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá danh mục');
      }
    } catch (err) {
      showError('Lỗi kết nối khi xoá danh mục');
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
      const createdBrand = brandName.trim();
      setBrandName('');
      setBrandSlug('');
      setBrandTag('');
      showSuccess(`Đã tạo thương hiệu "${createdBrand}" thành công!`);
      await onRefresh();
    } catch (err: any) {
      setBrandError(err?.message || 'Không thể tạo thương hiệu');
      showError(err?.message || 'Không thể tạo thương hiệu');
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá thương hiệu "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess(`Đã xoá thương hiệu "${name}" thành công!`);
        await onRefresh();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá thương hiệu');
      }
    } catch (err) {
      showError('Lỗi kết nối khi xoá thương hiệu');
    }
  };

  // Filter & Paginate Categories
  const filteredCategories = categories.filter((c) => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });
  const totalCategoryPages = Math.ceil(filteredCategories.length / categoryPageSize) || 1;
  const paginatedCategories = filteredCategories.slice(
    (categoryPage - 1) * categoryPageSize,
    categoryPage * categoryPageSize
  );

  // Filter & Paginate Brands
  const filteredBrands = brands.filter((b) => {
    if (!brandSearch.trim()) return true;
    const q = brandSearch.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.tag && b.tag.toLowerCase().includes(q))
    );
  });
  const totalBrandPages = Math.ceil(filteredBrands.length / brandPageSize) || 1;
  const paginatedBrands = filteredBrands.slice(
    (brandPage - 1) * brandPageSize,
    brandPage * brandPageSize
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        alignItems: 'flex-start',
      }}
    >
      {/* Column 1: Bảng Danh mục sản phẩm */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              Danh mục sản phẩm ({categories.length})
            </h3>
          </div>

          {/* Category Search Box */}
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Tìm danh mục..."
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
        </div>

        {/* Categories Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Tên danh mục</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Slug URL</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Không tìm thấy danh mục phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{c.name}</div>
                      {c.description && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{c.description}</div>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <code style={{ fontSize: '11px', background: 'var(--color-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                        {c.slug}
                      </code>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fee2e2',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '6px',
                        }}
                        title="Xoá danh mục"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Categories Pagination */}
        <Pagination
          currentPage={categoryPage}
          totalPages={totalCategoryPages}
          onPageChange={setCategoryPage}
          totalItems={filteredCategories.length}
          pageSize={categoryPageSize}
          onPageSizeChange={(newSize) => {
            setCategoryPageSize(newSize);
            setCategoryPage(1);
          }}
          pageSizeOptions={[5, 10, 15]}
        />

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} style={{ borderTop: '1px solid var(--color-border)', marginTop: '20px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start' }}
          >
            {catSubmitting ? 'Đang thêm...' : 'Lưu danh mục'}
          </button>
        </form>
      </div>

      {/* Column 2: Bảng Thương hiệu đối tác */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          background: 'white',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              Thương hiệu Hàn Quốc ({brands.length})
            </h3>
          </div>

          {/* Brand Search Box */}
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Tìm thương hiệu..."
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
        </div>

        {/* Brands Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Thương hiệu</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Slug & Tag</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--color-text-muted)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Không tìm thấy thương hiệu phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{b.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{b.origin || 'Hàn Quốc'}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <code style={{ fontSize: '11px', background: 'var(--color-bg)', padding: '2px 5px', borderRadius: '4px', width: 'fit-content' }}>
                          {b.slug}
                        </code>
                        {b.tag && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: 'rgba(139, 92, 246, 0.1)',
                              color: '#8b5cf6',
                              fontWeight: '700',
                              width: 'fit-content',
                            }}
                          >
                            {b.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(b.id, b.name)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fee2e2',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '6px',
                        }}
                        title="Xoá thương hiệu"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Brands Pagination */}
        <Pagination
          currentPage={brandPage}
          totalPages={totalBrandPages}
          onPageChange={setBrandPage}
          totalItems={filteredBrands.length}
          pageSize={brandPageSize}
          onPageSizeChange={(newSize) => {
            setBrandPageSize(newSize);
            setBrandPage(1);
          }}
          pageSizeOptions={[5, 10, 15]}
        />

        {/* Add Brand Form */}
        <form onSubmit={handleAddBrand} style={{ borderTop: '1px solid var(--color-border)', marginTop: '20px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              placeholder="slug-brand"
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
            placeholder="Khẩu hiệu hoặc đặc trưng (VD: Rau má lên men)"
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
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-md)', background: '#8b5cf6', alignSelf: 'flex-start' }}
          >
            {brandSubmitting ? 'Đang thêm...' : 'Lưu thương hiệu'}
          </button>
        </form>
      </div>
    </div>
  );
}
