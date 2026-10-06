'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, QrCode, Banknote, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import VietQRModal from '@/components/checkout/VietQRModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR'>('VIETQR');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdOrderTotal, setCreatedOrderTotal] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);

  // Calculations
  const discountAmount = appliedCoupon ? appliedDiscountAmount : 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.code);
        setAppliedDiscountPercent(data.discountPercent || 10);
        setAppliedDiscountAmount(data.discountAmount || 0);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Mã giảm giá không hợp lệ. Thử: KBEAUTY10');
      }
    } catch {
      setCouponError('Không thể kiểm tra mã giảm giá, vui lòng thử lại');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          shippingAddress: address,
          note,
          paymentMethod,
          items: cart,
          couponCode: appliedCoupon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Có lỗi xảy ra khi tạo đơn hàng');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      clearCart();

      if (paymentMethod === 'VIETQR') {
        setCreatedOrderId(data.orderId);
        setCreatedOrderTotal(finalTotal);
        setShowQRModal(true);
      } else {
        router.push(`/orders/${data.orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối mạng, vui lòng thử lại');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !showQRModal) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
            Giỏ hàng của bạn đang trống
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Vui lòng chọn sản phẩm trước khi thanh toán.
          </p>
          <Link href="/products" className="btn-primary">
            Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--color-bg)' }}>
      <div className="container">
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', letterSpacing: '-0.5px' }}>
          Thanh Toán Đơn Hàng
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div
            className="responsive-grid-1"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '32px',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Customer Info & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Shipping info */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '20px' }}>
                  1. Thông tin giao hàng
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Họ và tên người nhận <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                        Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                        Email (nhận mã đơn)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Địa chỉ nhận hàng chi tiết <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                      Ghi chú đơn hàng (tùy chọn)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>
                  2. Phương thức thanh toán
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'VIETQR' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: paymentMethod === 'VIETQR' ? 'var(--color-primary-light)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'VIETQR'}
                      onChange={() => setPaymentMethod('VIETQR')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <QrCode size={24} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>
                        Chuyển khoản VietQR tự động (Napas 247)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Quét mã QR qua app ngân hàng hoặc MoMo, tự động xác nhận tức thì
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'COD' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: paymentMethod === 'COD' ? 'var(--color-primary-light)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <Banknote size={24} color="#059669" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>
                        Thanh toán khi nhận hàng (COD)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Kiểm tra hàng rồi thanh toán tiền mặt cho bưu tá
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Coupon */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '18px' }}>
                Đơn hàng của bạn ({cart.length} món)
              </h3>

              {/* Items List */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill sizes="50px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {formatPrice(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher form */}
              <div style={{ marginBottom: '24px' }}>
                {appliedCoupon ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--color-primary-light)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      color: 'var(--color-primary)',
                      fontWeight: '700',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={16} /> Đã áp dụng mã: {appliedCoupon} (-{appliedDiscountPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setAppliedDiscountPercent(0);
                        setAppliedDiscountAmount(0);
                      }}
                      style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Gỡ
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Nhập mã voucher (vd: KBEAUTY10, GLOW20)"
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                          textTransform: 'uppercase',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon}
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        {isValidatingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && (
                      <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                        {couponError}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculation rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '600' }}>
                    <span>Giảm giá voucher ({appliedDiscountPercent}%):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí (Freeship)' : formatPrice(shippingFee)}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: '800',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '12px',
                    marginTop: '4px',
                  }}
                >
                  <span>Tổng thanh toán:</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  borderRadius: 'var(--radius-md)',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <span>{isSubmitting ? 'Đang tạo đơn hàng...' : 'Xác nhận đặt hàng'}</span>
                <ArrowRight size={18} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  marginTop: '16px',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={16} color="#10B981" />
                <span>Bảo mật thông tin khách hàng tuyệt đối</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* VietQR Modal Pop-up */}
      {showQRModal && createdOrderId && (
        <VietQRModal
          orderId={createdOrderId}
          amount={createdOrderTotal}
          onCompleted={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
