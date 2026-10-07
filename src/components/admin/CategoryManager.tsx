'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Pencil, Trash2, AlertCircle, X, Layers } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface CategoryManagerProps {
  categories: CategoryItem[];
  onRefresh: () => Promise<void>;
}

export default function CategoryManager({ categories, onRefresh }: CategoryManagerProps) {
  const { showSuccess, showError } = useToast();

  // Search, Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Pop-up Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDesc]);

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDesc('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDesc(cat.description || '');
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !slug.trim()) {
      setError('Vui lòng nhập tên và slug danh mục');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: name.trim(),
            slug: slug.trim(),
            description: desc.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Lỗi khi cập nhật danh mục');
        }

        showSuccess(`Đã cập nhật danh mục "${name.trim()}" thành công!`);
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description: desc.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Lỗi khi tạo danh mục');
        }

        showSuccess(`Đã tạo danh mục "${name.trim()}" thành công!`);
      }

      closeModal();
      await onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu danh mục');
      showError(err?.message || 'Không thể lưu danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá danh mục "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess(`Đã xoá danh mục "${catName}" thành công!`);
        await onRefresh();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá danh mục');
      }
    } catch (err) {
      showError('Lỗi kết nối khi xoá danh mục');
    }
  };

  // Filter & Pagination Logic
  const filteredCategories = categories.filter((c) => {
    if (filterDesc === 'has_desc' && !c.description?.trim()) return false;
    if (filterDesc === 'no_desc' && c.description?.trim()) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* Standard Control Bar: Search + Filter + Add Button */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục sản phẩm..."
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

          {/* Filter by Description Status */}
          <CustomSelect
            value={filterDesc}
            onChange={setFilterDesc}
            placeholder={`Tất cả phân loại (${categories.length})`}
            searchPlaceholder="Lọc danh mục..."
            options={[
              { value: '', label: `Tất cả phân loại (${categories.length})` },
              { value: 'has_desc', label: 'Có mô tả chi tiết' },
              { value: 'no_desc', label: 'Chưa có mô tả' },
            ]}
            enableSearch={false}
            style={{ minWidth: '190px' }}
          />
        </div>

        {/* Add Category Button */}
        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Plus size={16} />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* Standard Categories Table */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto',
          background: 'white',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '12px 16px', fontWeight: '700', width: '60px' }}>#</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tên danh mục</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Đường dẫn (Slug URL)</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Mô tả tóm tắt</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right', width: '120px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy danh mục nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử điều chỉnh lại từ khóa hoặc bộ lọc tìm kiếm
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((c, idx) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)', fontSize: '14px' }}>
                      {c.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <code
                      style={{
                        fontSize: '12px',
                        background: 'var(--color-bg)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#475569',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {c.slug}
                    </code>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                    {c.description || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>Chưa có mô tả</span>}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        title="Chỉnh sửa danh mục"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'white',
                          color: 'var(--color-text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Edit2 size={14} />
                        <span style={{ display: 'none' }}><Pencil size={14} /></span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        title="Xoá danh mục"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Standard Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCategories.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 8, 12, 20]}
        itemLabel="danh mục"
      />

      {/* Pop-up Modal Dialog for Add / Edit Category */}
      {isModalOpen && (
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
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '560px',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 107, 129, 0.1)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                    {editingCategory ? `Chỉnh sửa danh mục: ${editingCategory.name}` : 'Thêm danh mục sản phẩm mới'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {editingCategory ? 'Cập nhật tên, slug và mô tả phân loại' : 'Tạo mới danh mục mỹ phẩm K-Beauty chuẩn SEO'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#fef2f2',
                    color: '#ef4444',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Tên danh mục <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory && (!slug || slug === autoSlug(name))) {
                      setSlug(autoSlug(e.target.value));
                    }
                  }}
                  placeholder="VD: Kem Chống Nắng, Tinh Chất Serum"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Slug URL (SEO) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kem-chong-nang"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Mô tả tóm tắt
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="VD: Các dòng chống nắng dịu nhẹ, kiềm dầu chuẩn Hàn Quốc..."
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Modal Footer Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                  marginTop: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline"
                  style={{ padding: '9px 18px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    padding: '9px 24px',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-md)',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Đang lưu...' : editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
