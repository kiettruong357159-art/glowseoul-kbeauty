import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, ShieldCheck, Home, QrCode } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import OrderStatusTracker from '@/components/order/OrderStatusTracker';
import { generateVietQRUrl } from '@/lib/vietqr';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const qrUrl =
    order.paymentMethod === 'VIETQR'
      ? generateVietQRUrl({
          bankId: 'MB',
          accountNo: '0388888888',
          accountName: 'GLOWSEOUL STORE',
          amount: order.totalAmount,
          orderCode: order.id,
        })
      : null;

  return (
    <div style={{ padding: '50px 0 90px', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Success Header Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 32px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle size={36} />
          </div>

          <span
            style={{
              fontSize: '12px',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              letterSpacing: '1px',
            }}
          >
            Đặt hàng thành công
          </span>

          <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', marginBottom: '8px' }}>
            Cảm ơn bạn, {order.customerName}!
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Mã đơn hàng của bạn là{' '}
            <strong style={{ color: 'var(--color-text-main)', fontSize: '16px' }}>{order.id}</strong>.
            Chúng tôi đã ghi nhận đơn và đang chuẩn bị đóng gói gửi đến bạn.
          </p>

          {/* Tracking Bar */}
          <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: '20px 0' }}>
            <OrderStatusTracker status={order.orderStatus} />
          </div>

          {/* If VietQR payment option, display QR code for fast payment */}
          {qrUrl && (
            <div
              style={{
                marginTop: '28px',
                padding: '24px',
                borderRadius: '16px',
                background: 'var(--color-primary-light)',
                border: '1px solid rgba(255, 107, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '4px' }}>
                <QrCode size={20} />
                <span>Mã QR Chuyển Khoản Đơn Hàng</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Quét mã Napas247 dưới đây nếu bạn chưa thanh toán chuyển khoản:
              </p>
              <div
                style={{
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Image src={qrUrl} alt="VietQR Payment" fill sizes="200px" style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: '700' }}>
                Số tiền: <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.totalAmount)}</span> • Nội dung: <span>{order.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>
            Chi tiết đơn hàng
          </h2>

          {/* Recipient Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Địa chỉ giao hàng:
              </span>
              <strong>{order.customerName}</strong>
              <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>{order.phone}</div>
              <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>{order.shippingAddress}</div>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Phương thức thanh toán:
              </span>
              <strong>{order.paymentMethod === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Thanh toán tiền mặt khi nhận hàng (COD)'}</strong>
              <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Thời gian đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>

          {/* Products List */}
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
            Sản phẩm đã đặt ({order.items.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={item.image} alt={item.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</h4>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {formatPrice(item.price)} × {item.quantity}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary" style={{ flex: 1, padding: '14px' }}>
              <Home size={18} />
              <span>Về trang chủ</span>
            </Link>
            <Link href="/products" className="btn-outline" style={{ flex: 1, padding: '14px' }}>
              <span>Tiếp tục mua sắm</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
