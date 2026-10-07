'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Pencil, Trash2, AlertCircle, Globe, X, Award } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  tag?: string | null;
  origin?: string | null;
}

interface BrandManagerProps {
  brands: BrandItem[];
  onRefresh: () => Promise<void>;
}

export default function BrandManager({ brands, onRefresh }: BrandManagerProps) {
  const { showSuccess, showError } = useToast();

  // Search, Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Pop-up Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tag, setTag] = useState('');
  const [origin, setOrigin] = useState('Hàn Quốc');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, originFilter]);

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setTag('');
    setOrigin('Hàn Quốc');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: BrandItem) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setTag(b.tag || '');
    setOrigin(b.origin || 'Hàn Quốc');
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !slug.trim()) {
      setError('Vui lòng nhập tên và slug thương hiệu');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBrand) {
        const res = await fetch('/api/admin/brands', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBrand.id,
            name: name.trim(),
            slug: slug.trim(),
            tag: tag.trim() || null,
            origin: origin.trim() || 'Hàn Quốc',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Lỗi khi cập nhật thương hiệu');
        }

        showSuccess(`Đã cập nhật thương hiệu "${name.trim()}" thành công!`);
      } else {
        const res = await fetch('/api/admin/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            tag: tag.trim() || null,
            origin: origin.trim() || 'Hàn Quốc',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Lỗi khi tạo thương hiệu');
        }

        showSuccess(`Đã tạo thương hiệu "${name.trim()}" thành công!`);
      }

      closeModal();
      await onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu thương hiệu');
      showError(err?.message || 'Không thể lưu thương hiệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string, brandName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá thương hiệu "${brandName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess(`Đã xoá thương hiệu "${brandName}" thành công!`);
        await onRefresh();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá thương hiệu');
      }
    } catch (err) {
      showError('Lỗi kết nối khi xoá thương hiệu');
    }
  };

  // Compute unique origins
  const uniqueOrigins = Array.from(new Set(brands.map((b) => b.origin || 'Hàn Quốc')));

  // Filter & Pagination Logic
  const filteredBrands = brands.filter((b) => {
    if (originFilter && (b.origin || 'Hàn Quốc') !== originFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.tag && b.tag.toLowerCase().includes(q)) ||
      (b.origin && b.origin.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredBrands.length / pageSize) || 1;
  const paginatedBrands = filteredBrands.slice(
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
              placeholder="Tìm kiếm thương hiệu, xuất xứ, slogan..."
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

          {/* Filter by Origin */}
          <CustomSelect
            value={originFilter}
            onChange={setOriginFilter}
            placeholder={`Tất cả xuất xứ (${brands.length})`}
            searchPlaceholder="Tìm xuất xứ..."
            options={[
              { value: '', label: `Tất cả xuất xứ (${brands.length})` },
              ...uniqueOrigins.map((orig) => ({ value: orig, label: orig })),
            ]}
            enableSearch={false}
            style={{ minWidth: '190px' }}
          />
        </div>

        {/* Add Brand Button */}
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
          <span>Thêm thương hiệu mới</span>
        </button>
      </div>

      {/* Standard Brands Table */}
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
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tên thương hiệu</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Xuất xứ</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Đường dẫn (Slug URL)</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tag nhận diện / Slogan</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right', width: '120px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy thương hiệu nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử điều chỉnh lại từ khóa hoặc bộ lọc tìm kiếm
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBrands.map((b, idx) => (
                <tr
                  key={b.id}
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
                      {b.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#475569',
                        background: 'var(--color-bg)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <Globe size={13} color="#64748b" />
                      {b.origin || 'Hàn Quốc'}
                    </span>
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
                      {b.slug}
                    </code>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {b.tag ? (
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#8b5cf6',
                          fontWeight: '700',
                        }}
                      >
                        {b.tag}
                      </span>
                    ) : (
                      <span style={{ fontStyle: 'italic', opacity: 0.5, color: 'var(--color-text-muted)' }}>Chưa có tag</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        title="Chỉnh sửa thương hiệu"
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
                        onClick={() => handleDeleteBrand(b.id, b.name)}
                        title="Xoá thương hiệu"
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
        totalItems={filteredBrands.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 8, 12, 20]}
        itemLabel="thương hiệu"
      />

      {/* Pop-up Modal Dialog for Add / Edit Brand */}
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
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                    {editingBrand ? `Chỉnh sửa thương hiệu: ${editingBrand.name}` : 'Thêm thương hiệu đối tác mới'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {editingBrand ? 'Cập nhật tên, slug, khẩu hiệu và xuất xứ' : 'Thêm thương hiệu mỹ phẩm phân phối chính hãng'}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                    Tên thương hiệu <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingBrand && (!slug || slug === autoSlug(name))) {
                        setSlug(autoSlug(e.target.value));
                      }
                    }}
                    placeholder="VD: Skin1004, Anua..."
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
                    placeholder="skin1004"
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Tag nhận diện / Slogan nổi bật
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="VD: Rau má Madagascar, Diếp cá thanh lọc..."
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
                  Quốc gia xuất xứ
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Hàn Quốc"
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
                  {submitting ? 'Đang lưu...' : editingBrand ? 'Lưu thay đổi' : 'Thêm thương hiệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
