'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  Eye,
  RotateCw,
  AlertCircle,
  X,
  User,
  Mail,
  ArrowUpDown,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';

interface OrderItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderData {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  note?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemData[];
}

interface OrderManagerProps {
  orders: OrderData[];
  onRefresh: () => Promise<void>;
  loading?: boolean;
}

export default function OrderManager({ orders, onRefresh, loading }: OrderManagerProps) {
  const { showSuccess, showError } = useToast();

  // Search, Filter, Sort & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Status changer dropdown in table row
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);

  // Reset pagination on search, filter, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, sortBy]);

  // Close row status popovers when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setOpenStatusDropdownId(null);
    }
    if (openStatusDropdownId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openStatusDropdownId]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    setOpenStatusDropdownId(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          orderStatus: newStatus,
          paymentStatus: newStatus === 'delivered' ? 'paid' : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật trạng thái');
      }

      showSuccess(`Đã cập nhật đơn hàng ${orderId} thành "${getStatusLabel(newStatus)}"`);

      // Update selectedOrder if open in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: newStatus,
                paymentStatus: newStatus === 'delivered' ? 'paid' : prev.paymentStatus,
              }
            : null
        );
      }

      await onRefresh();
    } catch (err: any) {
      showError(err?.message || 'Không thể cập nhật đơn hàng');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusToggle = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          paymentStatus: nextStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi khi đổi trạng thái thanh toán');
      }

      showSuccess(`Đã chuyển đơn ${orderId} sang "${nextStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}"`);

      // Update selectedOrder if open in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                paymentStatus: nextStatus,
              }
            : null
        );
      }

      await onRefresh();
    } catch (err: any) {
      showError(err?.message || 'Không thể cập nhật');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao thành công';
      case 'cancelled':
        return 'Đã huỷ';
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: Clock, text: 'Đã xác nhận' };
      case 'shipping':
        return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', icon: Truck, text: 'Đang giao' };
      case 'delivered':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', icon: CheckCircle2, text: 'Đã giao' };
      case 'cancelled':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', icon: XCircle, text: 'Đã huỷ' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', icon: Clock, text: status };
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.orderStatus !== statusFilter) return false;
    if (paymentFilter && o.paymentStatus !== paymentFilter) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.email.toLowerCase().includes(q)
    );
  });

  // Sort Logic (Sắp xếp đơn hàng)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'amount_desc') {
      return b.totalAmount - a.totalAmount;
    }
    if (sortBy === 'amount_asc') {
      return a.totalAmount - b.totalAmount;
    }
    // Default: date_desc (Mới nhất)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusOptions = [
    { value: 'confirmed', label: 'Đã xác nhận', icon: Clock, color: '#1d4ed8' },
    { value: 'shipping', label: 'Đang giao', icon: Truck, color: '#6d28d9' },
    { value: 'delivered', label: 'Đã giao', icon: CheckCircle2, color: '#047857' },
    { value: 'cancelled', label: 'Đã huỷ', icon: XCircle, color: '#b91c1c' },
  ];

  return (
    <div>
      {/* Standard Control Bar: Search + Filters + Refresh Button */}
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
              placeholder="Tìm theo mã ORD, khách hàng, số ĐT..."
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

          {/* Status Filter */}
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder={`Tất cả trạng thái (${orders.length})`}
            options={[
              { value: '', label: `Tất cả trạng thái (${orders.length})` },
              { value: 'confirmed', label: 'Đã xác nhận' },
              { value: 'shipping', label: 'Đang giao' },
              { value: 'delivered', label: 'Đã giao' },
              { value: 'cancelled', label: 'Đã huỷ' },
            ]}
            enableSearch={false}
            style={{ minWidth: '170px' }}
          />

          {/* Payment Filter */}
          <CustomSelect
            value={paymentFilter}
            onChange={setPaymentFilter}
            placeholder="Tất cả thanh toán"
            options={[
              { value: '', label: 'Tất cả thanh toán' },
              { value: 'pending', label: 'Chờ thanh toán' },
              { value: 'paid', label: 'Đã thanh toán' },
            ]}
            enableSearch={false}
            style={{ minWidth: '165px' }}
          />

          {/* Sắp xếp đơn hàng (Sort Filter) */}
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sắp xếp đơn hàng"
            options={[
              { value: 'date_desc', label: 'Mới nhất trước' },
              { value: 'date_asc', label: 'Cũ nhất trước' },
              { value: 'amount_desc', label: 'Giá trị: Cao → Thấp' },
              { value: 'amount_asc', label: 'Giá trị: Thấp → Cao' },
            ]}
            enableSearch={false}
            style={{ minWidth: '180px' }}
          />
        </div>

        {/* Right Action: Refresh button & counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="btn-outline"
            title="Tải lại danh sách đơn hàng"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)',
              background: 'white',
            }}
          >
            <RotateCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Làm mới ({sortedOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
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
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Mã đơn & Ngày</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Khách hàng</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Sản phẩm mua</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Tổng tiền</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Thanh toán</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Trạng thái đơn</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Đang tải danh sách đơn hàng...
                </td>
              </tr>
            ) : sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy đơn hàng nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử điều chỉnh lại từ khóa hoặc bộ lọc tìm kiếm
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const badge = getStatusBadge(order.orderStatus);
                const BadgeIcon = badge.icon;
                const isPaid = order.paymentStatus === 'paid';
                const isStatusMenuOpen = openStatusDropdownId === order.id;

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    {/* Order Code & Date */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '14px' }}>
                        {order.id}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>
                        {order.customerName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <Phone size={11} /> {order.phone}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: 'var(--color-text-subtle)',
                          marginTop: '2px',
                          maxWidth: '200px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={order.shippingAddress}
                      >
                        <MapPin size={11} /> {order.shippingAddress}
                      </div>
                    </td>

                    {/* Purchased Products */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                            />
                            <div style={{ fontSize: '12px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>x{item.quantity}</span> {item.name}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            +{order.items.length - 2} sản phẩm khác...
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '800', color: 'var(--color-text-main)', fontSize: '14px' }}>
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <CreditCard size={11} /> {order.paymentMethod}
                      </div>
                    </td>

                    {/* Payment Status Badge Toggle */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handlePaymentStatusToggle(order.id, order.paymentStatus)}
                        title="Bấm để chuyển nhanh trạng thái thanh toán"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: `1px solid ${isPaid ? '#a7f3d0' : '#fde68a'}`,
                          background: isPaid ? '#ecfdf5' : '#fffbeb',
                          color: isPaid ? '#059669' : '#d97706',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        <span>{isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
                      </button>
                    </td>

                    {/* Order Status Custom Dropdown (No ugly native select) */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenStatusDropdownId(isStatusMenuOpen ? null : order.id);
                          }}
                          title="Bấm để cập nhật trạng thái đơn hàng"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <BadgeIcon size={12} />
                          <span>{badge.text}</span>
                          <ChevronDown
                            size={12}
                            style={{
                              transform: isStatusMenuOpen ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>

                        {/* Custom Status Popover Menu */}
                        {isStatusMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 4px)',
                              left: 0,
                              zIndex: 60,
                              background: 'white',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06)',
                              border: '1px solid var(--color-border)',
                              padding: '4px',
                              minWidth: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              animation: 'fadeIn 0.15s ease-out',
                            }}
                          >
                            {statusOptions.map((opt) => {
                              const OptIcon = opt.icon;
                              const isCurrent = order.orderStatus === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleStatusChange(order.id, opt.value)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '7px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: isCurrent ? 'var(--color-bg)' : 'transparent',
                                    color: isCurrent ? opt.color : 'var(--color-text-main)',
                                    fontWeight: isCurrent ? '700' : '500',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isCurrent) e.currentTarget.style.background = '#f8fafc';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isCurrent) e.currentTarget.style.background = 'transparent';
                                  }}
                                >
                                  <OptIcon size={13} color={opt.color} />
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Standardized Action Button */}
                    <td style={{ padding: '12px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="btn-outline"
                        title="Xem chi tiết đơn hàng"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'white',
                        }}
                      >
                        <Eye size={14} />
                        <span>Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={sortedOrders.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 8, 12, 20]}
        itemLabel="đơn hàng"
      />

      {/* Standardized Order Detail Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '620px',
              width: '100%',
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
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                    Chi tiết đơn hàng {selectedOrder.id}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
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

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Quick Status Bar inside Modal */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: 'var(--color-bg)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                    Trạng thái đơn:
                  </span>
                  <div style={{ minWidth: '150px' }}>
                    <CustomSelect
                      value={selectedOrder.orderStatus}
                      onChange={(newVal) => handleStatusChange(selectedOrder.id, newVal)}
                      options={[
                        { value: 'confirmed', label: 'Đã xác nhận' },
                        { value: 'shipping', label: 'Đang giao' },
                        { value: 'delivered', label: 'Đã giao' },
                        { value: 'cancelled', label: 'Đã huỷ' },
                      ]}
                      enableSearch={false}
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                    Thanh toán:
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePaymentStatusToggle(selectedOrder.id, selectedOrder.paymentStatus)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: `1px solid ${selectedOrder.paymentStatus === 'paid' ? '#a7f3d0' : '#fde68a'}`,
                      background: selectedOrder.paymentStatus === 'paid' ? '#ecfdf5' : '#fffbeb',
                      color: selectedOrder.paymentStatus === 'paid' ? '#059669' : '#d97706',
                    }}
                  >
                    {selectedOrder.paymentStatus === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    <span>{selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#fafafa', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <User size={13} />
                    <span>Thông tin người nhận</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                    {selectedOrder.customerName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <Phone size={12} />
                    <span>{selectedOrder.phone}</span>
                  </div>
                  {selectedOrder.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      <Mail size={12} />
                      <span>{selectedOrder.email}</span>
                    </div>
                  )}
                </div>

                <div style={{ background: '#fafafa', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <MapPin size={13} />
                    <span>Địa chỉ giao hàng</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
                    {selectedOrder.shippingAddress}
                  </div>
                  {selectedOrder.note && (
                    <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontStyle: 'italic', marginTop: '6px', background: 'var(--color-primary-light)', padding: '4px 8px', borderRadius: '4px' }}>
                      Ghi chú: {selectedOrder.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Danh sách sản phẩm ({selectedOrder.items.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items.map((it, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'white',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={it.image}
                          alt={it.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>{it.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Đơn giá: {formatPrice(it.price)} × <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{it.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)' }}>
                        {formatPrice(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Phương thức thanh toán:</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <CreditCard size={14} color="var(--color-primary)" />
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Tổng thanh toán đơn:</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>
                    {formatPrice(selectedOrder.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '16px 24px',
                borderTop: '1px solid var(--color-border)',
                background: '#fafaf9',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-outline"
                style={{ padding: '9px 24px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
