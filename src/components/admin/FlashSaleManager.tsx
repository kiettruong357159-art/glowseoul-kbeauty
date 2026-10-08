'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Plus, Pencil, Trash2, Calendar, Clock, Check, X, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import Pagination from '@/components/ui/Pagination';
import FlashSaleProgressBar from '@/components/ui/FlashSaleProgressBar';
import CountdownTimer from '@/components/ui/CountdownTimer';

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  discountPrice: number;
  limitQuantity: number;
  soldQuantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    images: string;
    stock: number;
  };
}

export interface FlashSaleCampaign {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  items: FlashSaleItem[];
}

interface FlashSaleManagerProps {
  canManage?: boolean;
}

export default function FlashSaleManager({ canManage = true }: FlashSaleManagerProps) {
  const { showSuccess, showError } = useToast();

  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Available store products for selection
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<FlashSaleCampaign | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{
    productId: string;
    discountPrice: number;
    limitQuantity: number;
    soldQuantity?: number;
  }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch campaigns
  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/flash-sales?page=${currentPage}&pageSize=${pageSize}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load flash sales:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Fetch all products for selector
  const loadAllProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products for picker:', err);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setTitle('Flash Sale Giờ Vàng 20:00 - 24:00');
    setDescription('Ưu đãi mỹ phẩm Hàn Quốc chính hãng giảm giá sốc');
    
    // Default: starts now, ends in 4 hours
    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    setStartTime(now.toISOString().slice(0, 16));
    setEndTime(fourHoursLater.toISOString().slice(0, 16));
    setIsActive(true);

    // Default select first 2 products with 30% discount
    if (allProducts.length > 0) {
      setSelectedItems(
        allProducts.slice(0, 2).map((p) => ({
          productId: p.id,
          discountPrice: Math.round(p.price * 0.7),
          limitQuantity: 50,
          soldQuantity: 0,
        }))
      );
    } else {
      setSelectedItems([]);
    }

    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp: FlashSaleCampaign) => {
    setEditingCampaign(camp);
    setTitle(camp.title);
    setDescription(camp.description || '');
    setStartTime(new Date(camp.startTime).toISOString().slice(0, 16));
    setEndTime(new Date(camp.endTime).toISOString().slice(0, 16));
    setIsActive(camp.isActive);
    setSelectedItems(
      camp.items.map((it) => ({
        productId: it.productId,
        discountPrice: it.discountPrice,
        limitQuantity: it.limitQuantity,
        soldQuantity: it.soldQuantity,
      }))
    );
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleProductSelection = (product: any) => {
    const exists = selectedItems.find((i) => i.productId === product.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.productId !== product.id));
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: product.id,
          discountPrice: Math.round(product.price * 0.7), // Default 30% off
          limitQuantity: 50,
          soldQuantity: 0,
        },
      ]);
    }
  };

  const handleUpdateItemField = (productId: string, field: 'discountPrice' | 'limitQuantity', value: number) => {
    setSelectedItems(
      selectedItems.map((item) => {
        if (item.productId === productId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Vui lòng nhập tên chiến dịch');
      return;
    }
    if (!startTime || !endTime) {
      setFormError('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setFormError('Thời gian kết thúc phải diễn ra sau thời gian bắt đầu');
      return;
    }
    if (selectedItems.length === 0) {
      setFormError('Vui lòng chọn ít nhất 1 sản phẩm tham gia Flash Sale');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = Boolean(editingCampaign?.id);
      const url = '/api/admin/flash-sales';
      const method = isEdit ? 'PUT' : 'POST';

      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        isActive,
        items: selectedItems,
      };

      if (isEdit) {
        payload.id = editingCampaign!.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi lưu chiến dịch');
      }

      showSuccess(isEdit ? 'Cập nhật chiến dịch Flash Sale thành công!' : 'Tạo mới chiến dịch Flash Sale thành công!');
      setIsModalOpen(false);
      await loadCampaigns();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi lưu chiến dịch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chiến dịch "${name}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/flash-sales?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi xóa');
      }
      showSuccess('Đã xóa chiến dịch thành công!');
      await loadCampaigns();
    } catch (err: any) {
      showError(err.message || 'Lỗi khi xóa chiến dịch');
    }
  };

  const handleToggleActive = async (camp: FlashSaleCampaign) => {
    try {
      const res = await fetch('/api/admin/flash-sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: camp.id,
          isActive: !camp.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lỗi');
      showSuccess(camp.isActive ? 'Đã tắt chiến dịch!' : 'Đã bật chiến dịch!');
      await loadCampaigns();
    } catch (err: any) {
      showError(err.message || 'Lỗi cập nhật');
    }
  };

  const getCampaignStatus = (camp: FlashSaleCampaign) => {
    const now = new Date();
    const start = new Date(camp.startTime);
    const end = new Date(camp.endTime);

    if (!camp.isActive) {
      return { text: 'Tạm dừng', color: 'var(--color-text-subtle)', bg: '#f1f5f9' };
    }
    if (now < start) {
      return { text: 'Sắp diễn ra', color: '#b45309', bg: '#fef3c7' };
    }
    if (now >= start && now <= end) {
      return { text: '⚡ Đang diễn ra', color: '#b91c1c', bg: '#fee2e2' };
    }
    return { text: 'Đã kết thúc', color: '#64748b', bg: '#f1f5f9' };
  };

  return (
    <div>
      {/* Top action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
            Quản Lý Khuyến Mãi Flash Sale
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Lên lịch khung giờ vàng, thiết lập mức giá ưu đãi và giới hạn suất bán tự động
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreateModal}
            style={{
              padding: '10px 18px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            <Plus size={16} />
            Tạo Chiến Dịch Mới
          </button>
        )}
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Đang tải dữ liệu chiến dịch Flash Sale...
        </div>
      ) : campaigns.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Zap size={36} color="var(--color-primary)" style={{ opacity: 0.5, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 6px' }}>Chưa có chiến dịch Flash Sale nào</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Tạo chiến dịch giờ vàng đầu tiên để kích hoạt trải nghiệm săn deal kịch tính cho khách hàng.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {campaigns.map((camp) => {
            const status = getCampaignStatus(camp);
            return (
              <div
                key={camp.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    paddingBottom: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.text}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
                        {camp.title}
                      </h3>
                    </div>

                    {camp.description && (
                      <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {camp.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        Bắt đầu: {new Date(camp.startTime).toLocaleString('vi-VN')}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        Kết thúc: {new Date(camp.endTime).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {canManage && (
                      <>
                        <button
                          onClick={() => handleToggleActive(camp)}
                          style={{
                            padding: '6px 12px',
                            background: camp.isActive ? '#fff0f3' : '#f1f5f9',
                            color: camp.isActive ? 'var(--color-primary-hover)' : 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {camp.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(camp)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--color-text-main)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Pencil size={13} />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(camp.id, camp.title)}
                          style={{
                            padding: '6px 10px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                          }}
                          title="Xóa chiến dịch"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Items in Campaign */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-text-main)' }}>
                    Danh sách sản phẩm trong khung giờ ({camp.items.length} sản phẩm):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {camp.items.map((it) => {
                      const p = it.product;
                      return (
                        <div
                          key={it.id}
                          style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-subtle)',
                            background: 'var(--color-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
                              {p?.name || 'Sản phẩm không xác định'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                                {formatPrice(it.discountPrice)}
                              </span>
                              {p?.price && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                                  {formatPrice(p.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <FlashSaleProgressBar soldQuantity={it.soldQuantity} limitQuantity={it.limitQuantity} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / pageSize) || 1}
            onPageChange={setCurrentPage}
            totalItems={total}
            pageSize={pageSize}
          />
        </div>
      )}

      {/* Modal Tạo / Sửa Campaign */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {editingCampaign ? 'Chỉnh Sửa Chiến Dịch Flash Sale' : 'Tạo Chiến Dịch Flash Sale Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCampaign}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Tiêu đề chiến dịch *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Mô tả chiến dịch
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Thời gian bắt đầu *
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.875rem',
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Thời gian kết thúc *
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.875rem',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Product Selection List */}
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px' }}>
                  Chọn sản phẩm & Mức giá Flash Sale ({selectedItems.length} sản phẩm đã chọn):
                </label>

                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px',
                  }}
                >
                  {allProducts.map((p) => {
                    const isSelected = selectedItems.some((i) => i.productId === p.id);
                    const currentItem = selectedItems.find((i) => i.productId === p.id);

                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                          borderBottom: '1px solid var(--color-border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProductSelection(p)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Giá gốc: {formatPrice(p.price)} | Tồn kho: {p.stock}
                            </div>
                          </div>
                        </div>

                        {isSelected && currentItem && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                Giá sale:
                              </span>
                              <input
                                type="number"
                                value={currentItem.discountPrice}
                                onChange={(e) =>
                                  handleUpdateItemField(p.id, 'discountPrice', Math.max(0, parseInt(e.target.value, 10) || 0))
                                }
                                style={{
                                  width: '100px',
                                  padding: '4px 6px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--color-border)',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  color: 'var(--color-primary)',
                                }}
                              />
                            </div>

                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                Suất bán:
                              </span>
                              <input
                                type="number"
                                value={currentItem.limitQuantity}
                                onChange={(e) =>
                                  handleUpdateItemField(p.id, 'limitQuantity', Math.max(1, parseInt(e.target.value, 10) || 1))
                                }
                                style={{
                                  width: '65px',
                                  padding: '4px 6px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--color-border)',
                                  fontSize: '0.85rem',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="isActiveCampaign"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="isActiveCampaign" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Kích hoạt chiến dịch ngay
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Đang lưu...' : editingCampaign ? 'Lưu Thay Đổi' : 'Tạo Chiến Dịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
