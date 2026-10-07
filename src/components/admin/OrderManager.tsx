'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, Phone, MapPin, CreditCard, ChevronDown } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter]);


  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
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

      showSuccess(`Đã chuyển đơn ${orderId} sang ${nextStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}`);
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
        return 'Đang giao';
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

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã ORD, tên khách hàng, số điện thoại..."
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
            placeholder="Tất cả trạng thái"
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              { value: 'confirmed', label: 'Đã xác nhận' },
              { value: 'shipping', label: 'Đang giao' },
              { value: 'delivered', label: 'Đã giao' },
              { value: 'cancelled', label: 'Đã huỷ' },
            ]}
            enableSearch={false}
            style={{ minWidth: '160px' }}
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
            style={{ minWidth: '160px' }}
          />
        </div>

        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
          Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
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
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const badge = getStatusBadge(order.orderStatus);
                  const BadgeIcon = badge.icon;
                  const isPaid = order.paymentStatus === 'paid';

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid var(--color-border-subtle)',
                        transition: 'background 0.15s ease',
                      }}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.shippingAddress}>
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

                      {/* Payment Status Badge */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => handlePaymentStatusToggle(order.id, order.paymentStatus)}
                          title="Bấm để chuyển trạng thái thanh toán"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            border: '1px solid transparent',
                            background: isPaid ? '#ecfdf5' : '#fffbeb',
                            color: isPaid ? '#059669' : '#d97706',
                          }}
                        >
                          {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          <span>{isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
                        </button>
                      </td>

                      {/* Order Status Badge & Inline Quick Switch */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            <BadgeIcon size={12} />
                            <span>{badge.text}</span>
                          </span>

                          {/* Quick Status Select */}
                          <select
                            value={order.orderStatus}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              padding: '2px 4px',
                              fontSize: '11px',
                              borderRadius: '4px',
                              border: '1px solid var(--color-border)',
                              background: 'white',
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            <option value="confirmed">Xác nhận</option>
                            <option value="shipping">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Huỷ đơn</option>
                          </select>
                        </div>
                      </td>

                      {/* View Details Modal Trigger */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            background: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--color-text-main)',
                            cursor: 'pointer',
                          }}
                        >
                          Chi tiết
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
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 8, 12, 20]}
        />
      </div>

      {/* Order Detail Modal */}
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
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Chi tiết đơn hàng {selectedOrder.id}</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Ngày tạo: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', background: '#f9fafb', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Khách hàng</div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '12px' }}>{selectedOrder.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Giao đến</div>
                <div style={{ fontSize: '12px' }}>{selectedOrder.shippingAddress}</div>
                {selectedOrder.note && (
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontStyle: 'italic', marginTop: '2px' }}>
                    Ghi chú: {selectedOrder.note}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Sản phẩm đã chọn:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedOrder.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={it.image} alt={it.name} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>{it.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>x{it.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-primary)' }}>
                {formatPrice(selectedOrder.totalAmount)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
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
