'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, AlertCircle, ArrowRight } from 'lucide-react';
import { generateVietQRUrl } from '@/lib/vietqr';
import { formatPrice } from '@/lib/utils';

export default function VietQRModal({
  orderId,
  amount,
  onCompleted,
}: {
  orderId: string;
  amount: number;
  onCompleted: () => void;
}) {
  const router = useRouter();

  const qrConfig = {
    bankId: 'MB',
    accountNo: '0388888888',
    accountName: 'GLOWSEOUL STORE',
    amount,
    orderCode: orderId,
  };

  const qrUrl = generateVietQRUrl(qrConfig);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép: ${text}`);
  };

  const handleConfirmPaid = () => {
    onCompleted();
    router.push(`/orders/${orderId}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal Dialog */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          background: 'white',
          borderRadius: '24px',
          padding: '32px 28px',
          textAlign: 'center',
          zIndex: 121,
          animation: 'fadeIn 0.25s ease',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
          Quét Mã VietQR Để Thanh Toán
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
          Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ để quét mã Napas247
        </p>

        {/* QR Code Container */}
        <div
          style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            margin: '0 auto 20px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            background: 'white',
          }}
        >
          <Image
            src={qrUrl}
            alt="Mã VietQR Thanh Toán"
            fill
            sizes="260px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </div>

        {/* Bank Transfer Details Box */}
        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '13px',
            textAlign: 'left',
            marginBottom: '20px',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Ngân hàng:</span>
            <strong>MB Bank (Ngân hàng Quân Đội)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Số tài khoản:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>{qrConfig.accountNo}</strong>
              <button onClick={() => handleCopy(qrConfig.accountNo)} title="Sao chép">
                <Copy size={14} color="var(--color-primary)" />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Số tiền:</span>
            <strong style={{ color: 'var(--color-primary)', fontSize: '15px' }}>
              {formatPrice(amount)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Nội dung CK:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: 'var(--color-primary)' }}>{orderId}</strong>
              <button onClick={() => handleCopy(orderId)} title="Sao chép">
                <Copy size={14} color="var(--color-primary)" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirmPaid}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Tôi đã hoàn tất chuyển khoản</span>
        </button>
      </div>
    </div>
  );
}
