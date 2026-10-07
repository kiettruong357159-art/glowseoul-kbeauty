import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  skinType: string;
  ingredients: string;
  description: string;
  usage: string;
  images: string;
  stock: number;
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductListTableProps {
  products: ProductItem[];
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedBrand: string;
  onBrandChange: (val: string) => void;
  onAddNew: () => void;
  onEdit: (product: ProductItem) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function ProductListTable({
  products,
  categories,
  brands,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  onAddNew,
  onEdit,
  onDelete,
  loading = false,
}: ProductListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedBrand]);

  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const parseFirstImage = (imagesStr: string): string => {
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === 'string') return parsed;
    } catch {
      if (imagesStr && imagesStr.startsWith('http')) return imagesStr;
    }
    return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div>
      {/* Control bar: search, category, brand, add button */}
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
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

          {/* Category Filter */}
          <CustomSelect
            value={selectedCategory}
            onChange={onCategoryChange}
            placeholder={`Tất cả danh mục (${categories.length})`}
            searchPlaceholder="Tìm danh mục..."
            options={[
              { value: '', label: `Tất cả danh mục (${categories.length})` },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            style={{ minWidth: '190px' }}
          />

          {/* Brand Filter */}
          <CustomSelect
            value={selectedBrand}
            onChange={onBrandChange}
            placeholder={`Tất cả thương hiệu (${brands.length})`}
            searchPlaceholder="Tìm thương hiệu..."
            options={[
              { value: '', label: `Tất cả thương hiệu (${brands.length})` },
              ...brands.map((b) => ({ value: b.name, label: b.name })),
            ]}
            style={{ minWidth: '190px' }}
          />
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={onAddNew}
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
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Products Table */}
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
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Sản phẩm</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Danh mục</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Giá bán</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tồn kho</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Huy hiệu</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Đang tải danh sách sản phẩm...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy sản phẩm nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử điều chỉnh lại từ khóa hoặc bộ lọc tìm kiếm
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const imgUrl = parseFirstImage(p.images);
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    {/* Thumbnail & Name */}
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
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ minWidth: 0, maxWidth: '280px' }}>
                          <div
                            style={{
                              fontWeight: '700',
                              color: 'var(--color-text-main)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={p.name}
                          >
                            {p.name}
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
                              {p.brand}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              • Da: {p.skinType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-main)', fontWeight: '600' }}>
                      {p.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '800', color: 'var(--color-primary)' }}>
                        {formatPrice(p.price)}
                      </div>
                      {p.originalPrice && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock level */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '800',
                          background: p.stock > 20 ? '#ecfdf5' : p.stock > 0 ? '#fffbeb' : '#fef2f2',
                          color: p.stock > 20 ? '#059669' : p.stock > 0 ? '#d97706' : '#dc2626',
                        }}
                      >
                        {p.stock > 0 ? `${p.stock} sản phẩm` : 'Hết hàng'}
                      </span>
                    </td>

                    {/* Badges */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.isBestSeller && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: '#fef3c7',
                              color: '#b45309',
                            }}
                          >
                            Hot
                          </span>
                        )}
                        {p.isNew && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                            }}
                          >
                            Mới
                          </span>
                        )}
                        {!p.isBestSeller && !p.isNew && (
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>-</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          title="Chỉnh sửa sản phẩm"
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
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xoá sản phẩm "${p.name}"?`)) {
                              onDelete(p.id);
                            }
                          }}
                          title="Xoá sản phẩm"
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={products.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 8, 12, 20]}
      />
    </div>
  );
}
