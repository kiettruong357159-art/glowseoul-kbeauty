'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface FlashSaleProgressBarProps {
  soldQuantity: number;
  limitQuantity: number;
  showFlame?: boolean;
}

export function calculateProgress(sold: number, limit: number) {
  const safeLimit = Math.max(1, limit);
  const safeSold = Math.max(0, sold);
  const percent = Math.min(100, Math.round((safeSold / safeLimit) * 100));
  const remaining = Math.max(0, safeLimit - safeSold);
  const isSoldOut = safeSold >= safeLimit;
  const isNearlySoldOut = percent >= 80 && !isSoldOut;

  return { percent, remaining, isSoldOut, isNearlySoldOut };
}

export default function FlashSaleProgressBar({
  soldQuantity,
  limitQuantity,
  showFlame = true,
}: FlashSaleProgressBarProps) {
  const { percent, remaining, isSoldOut, isNearlySoldOut } = calculateProgress(soldQuantity, limitQuantity);

  let labelText = `Đã bán ${soldQuantity}/${limitQuantity}`;
  if (isSoldOut) {
    labelText = 'Đã hết suất Flash Sale';
  } else if (isNearlySoldOut) {
    labelText = `🔥 Chỉ còn ${remaining} suất cuối`;
  }

  return (
    <div style={{ width: '100%', marginTop: '6px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: isSoldOut ? 'var(--color-text-subtle)' : isNearlySoldOut ? 'var(--color-primary-hover)' : 'var(--color-text-muted)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {showFlame && !isSoldOut && (
            <Flame
              size={13}
              color="var(--color-primary)"
              style={{ animation: isNearlySoldOut ? 'pulse 1.5s infinite' : 'none' }}
            />
          )}
          {labelText}
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {percent}%
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '7px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: isSoldOut
              ? 'var(--color-text-subtle)'
              : 'linear-gradient(90deg, #ffa07a 0%, #ff6b81 60%, #fa5252 100%)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: percent > 0 && !isSoldOut ? '0 0 8px rgba(255, 107, 129, 0.4)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
