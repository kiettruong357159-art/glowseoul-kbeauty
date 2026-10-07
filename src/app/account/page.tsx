'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  Heart,
  Settings,
  LogOut,
  ExternalLink,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ArrowRight,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
}

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: '#b45309', bg: '#fef3c7', icon: Clock },
  PROCESSING: { label: 'Đang đóng gói', color: '#1d4ed8', bg: '#dbeafe', icon: Package },
  SHIPPED: { label: 'Đang vận chuyển', color: '#6d28d9', bg: '#ede9fe', icon: Truck },
  DELIVERED: { label: 'Giao thành công', color: '#15803d', bg: '#dcfce7', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy', color: '#b91c1c', bg: '#fee2e2', icon: Clock },
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const { addItem, setIsCartOpen } = useCart();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Wishlist State
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Fetch orders
  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/account/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load account orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Fetch wishlist
  const loadWishlist = useCallback(async () => {
    try {
      const res = await fetch('/api/account/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  // Fetch profile
  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/account/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setProfileName(data.user.name || '');
          setProfilePhone(data.user.phone || '');
          setProfileAddress(data.user.address || '');
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadOrders();
      loadWishlist();
      loadProfile();
    }
  }, [user, loadOrders, loadWishlist, loadProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone,
          address: profileAddress,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess('Cập nhật thông tin tài khoản thành công!');
        await refreshUser();
      } else {
        showError(data.error || 'Cập nhật thất bại');
      }
    } catch {
      showError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlist((prev) => prev.filter((p) => p.id !== productId));
        showSuccess('Đã xóa sản phẩm khỏi danh sách yêu thích');
      }
    } catch {
      showError('Không thể xóa sản phẩm khỏi danh sách yêu thích');
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
          brand: 'GlowSeoul',
        },
        item.quantity
      );
    });
    showSuccess(`Đã thêm ${order.items.length} món từ đơn ${order.id} vào giỏ!`);
    setIsCartOpen(true);
  };

  // Unauthenticated State
  if (!authLoading && !user) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-bg-subtle, #fdf2f4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <UserIcon size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
            Tài Khoản Khách Hàng
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '28px', lineHeight: '1.6' }}>
            Vui lòng đăng nhập để xem lịch sử đơn hàng, hành trình giao hàng và bộ sưu tập sản phẩm yêu thích của bạn.
          </p>
          <Link
            href="/login?redirect=/account"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 80px', background: 'var(--color-bg, #fafafa)', minHeight: '80vh' }}>
      <div className="container">
        {/* User Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 50%, #ffffff 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-gradient-brand)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: '900',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>
                  Xin chào, {user?.name || 'Khách hàng'}!
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#e11d48',
                    background: '#ffe4e6',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <Sparkles size={12} /> Glow VIP
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {user?.email} • {user?.role === 'ADMIN' ? 'Quản trị viên' : user?.role === 'STAFF' ? 'Nhân viên vận hành' : 'Khách hàng thân thiết'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                <Shield size={15} />
                <span>Trang Quản Trị</span>
              </Link>
            )}
            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                background: 'white',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Portal Layout: Left Tabs & Right Content */}
        <div
          className="responsive-grid-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 260px) 1fr',
            gap: '28px',
            alignItems: 'flex-start',
          }}
        >
          {/* Navigation Sidebar */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'orders' ? 'var(--color-primary-light, #fce7f3)' : 'transparent',
                  color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: activeTab === 'orders' ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Package size={18} />
                <span>Đơn hàng của tôi</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: activeTab === 'orders' ? 'var(--color-primary)' : '#e5e7eb',
                    color: activeTab === 'orders' ? 'white' : 'var(--color-text-muted)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'wishlist' ? 'var(--color-primary-light, #fce7f3)' : 'transparent',
                  color: activeTab === 'wishlist' ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: activeTab === 'wishlist' ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Heart size={18} />
                <span>Sản phẩm yêu thích</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: activeTab === 'wishlist' ? 'var(--color-primary)' : '#e5e7eb',
                    color: activeTab === 'wishlist' ? 'white' : 'var(--color-text-muted)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'profile' ? 'var(--color-primary-light, #fce7f3)' : 'transparent',
                  color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: activeTab === 'profile' ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Settings size={18} />
                <span>Thông tin cá nhân</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              minHeight: '450px',
            }}
          >
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                      Lịch Sử Đơn Hàng
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Theo dõi quá trình chuẩn bị hàng, vận chuyển và nhận hàng từ GlowSeoul.
                    </p>
                  </div>
                </div>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                    Đang tải danh sách đơn hàng...
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#f3f4f6',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <Package size={28} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>
                      Chưa có đơn hàng nào
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                      Hãy trải nghiệm các dòng mỹ phẩm K-Beauty thuần chay bán chạy nhất hôm nay!
                    </p>
                    <Link
                      href="/products"
                      className="btn-primary"
                      style={{
                        padding: '10px 24px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((ord) => {
                      const statusConf = ORDER_STATUS_CONFIG[ord.orderStatus] || ORDER_STATUS_CONFIG.PENDING;
                      const StatusIcon = statusConf.icon;

                      return (
                        <div
                          key={ord.id}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                            background: '#fafafa',
                          }}
                        >
                          {/* Order Top Bar */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '10px',
                              paddingBottom: '14px',
                              borderBottom: '1px solid var(--color-border-subtle)',
                              marginBottom: '14px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--color-primary)' }}>
                                #{ord.id}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>
                                {new Date(ord.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: statusConf.color,
                                background: statusConf.bg,
                              }}
                            >
                              <StatusIcon size={13} />
                              <span>{statusConf.label}</span>
                            </span>
                          </div>

                          {/* Order Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                            {ord.items.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '12px',
                                  fontSize: '13px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      position: 'relative',
                                      background: '#f3f4f6',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Image
                                      src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=120&q=80'}
                                      alt={item.name}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                                      {item.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                      Số lượng: <strong>{item.quantity}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer Actions & Total */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px',
                              paddingTop: '14px',
                              borderTop: '1px solid var(--color-border-subtle)',
                            }}
                          >
                            <div style={{ fontSize: '14px' }}>
                              Tổng thanh toán:{' '}
                              <strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                                {formatPrice(ord.totalAmount)}
                              </strong>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleReorder(ord)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 14px',
                                  borderRadius: 'var(--radius-full)',
                                  border: '1px solid var(--color-border)',
                                  background: 'white',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  color: 'var(--color-text-main)',
                                }}
                              >
                                <RotateCcw size={14} />
                                <span>Mua lại</span>
                              </button>

                              <Link
                                href={`/orders/${ord.id}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 16px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--color-primary)',
                                  color: 'white',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  textDecoration: 'none',
                                }}
                              >
                                <ExternalLink size={14} />
                                <span>Theo dõi đơn</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                      Sản Phẩm Yêu Thích
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Các sản phẩm bạn đã lưu để theo dõi và chuẩn bị cho lần mua sắm tiếp theo.
                    </p>
                  </div>
                </div>

                {wishlistLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                    Đang tải danh sách yêu thích...
                  </div>
                ) : wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#fee2e2',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <Heart size={28} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>
                      Danh sách yêu thích trống
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                      Nhấn vào biểu tượng trái tim ở từng sản phẩm để lưu lại vào đây nhé!
                    </p>
                    <Link
                      href="/products"
                      className="btn-primary"
                      style={{
                        padding: '10px 24px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Khám phá sản phẩm ngay
                    </Link>
                  </div>
                ) : (
                  <div
                    className="responsive-grid-2"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {wishlist.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(prod.id)}
                          title="Xóa khỏi yêu thích"
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                        >
                          <Trash2 size={15} />
                        </button>

                        {/* Image */}
                        <Link href={`/products/${prod.id}`} style={{ position: 'relative', height: '180px', background: '#f9f9f9', display: 'block' }}>
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            style={{ objectFit: 'contain', padding: '12px' }}
                          />
                        </Link>

                        {/* Content */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            {prod.brand}
                          </span>
                          <Link
                            href={`/products/${prod.id}`}
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: 'var(--color-text-main)',
                              margin: '4px 0 10px',
                              textDecoration: 'none',
                              lineHeight: '1.4',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {prod.name}
                          </Link>

                          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '12px' }}>
                              {formatPrice(prod.price)}
                            </div>

                            <button
                              onClick={() => {
                                addItem(
                                  {
                                    id: prod.id,
                                    name: prod.name,
                                    price: prod.price,
                                    image: prod.image,
                                    brand: prod.brand,
                                  },
                                  1
                                );
                                showSuccess(`Đã thêm ${prod.name} vào giỏ hàng!`);
                                setIsCartOpen(true);
                              }}
                              className="btn-outline"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                              }}
                            >
                              <ShoppingBag size={14} />
                              <span>Thêm vào giỏ</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROFILE */}
            {activeTab === 'profile' && (
              <div style={{ maxWidth: '540px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                    Thông Tin Cá Nhân
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Quản lý thông tin tài khoản và địa chỉ nhận hàng mặc định.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Email đăng nhập
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        background: '#f3f4f6',
                        color: 'var(--color-text-muted)',
                        fontSize: '14px',
                        cursor: 'not-allowed',
                      }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px', display: 'block' }}>
                      Email dùng để đăng nhập và nhận thông báo hành trình đơn hàng.
                    </span>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Số điện thoại nhận hàng
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Ví dụ: 0912 345 678"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Địa chỉ giao hàng mặc định
                    </label>
                    <textarea
                      rows={3}
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="btn-primary"
                    style={{
                      padding: '12px 28px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '14px',
                      fontWeight: '700',
                    }}
                  >
                    {profileSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
