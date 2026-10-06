'use client';

import React from 'react';
import { Truck, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function FreeShippingBar() {
  const { freeShippingRemaining, progressPercent } = useCart();
  const isFree = freeShippingRemaining === 0;

  return (
    <div
      style={{
        background: 'var(--color-primary-light)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: isFree ? '#059669' : 'var(--color-primary)',
          marginBottom: '8px',
        }}
      >
        {isFree ? (
          <>
            <CheckCircle size={16} />
            <span>Chúc mừng! Bạn được <strong>Freeship toàn quốc</strong></span>
          </>
        ) : (
          <>
            <Truck size={16} />
            <span>
              Mua thêm <strong>{formatPrice(freeShippingRemaining)}</strong> để nhận Freeship!
            </span>
          </>
        )}
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 107, 129, 0.2)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: isFree ? '#10B981' : 'var(--color-primary)',
            borderRadius: '999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
