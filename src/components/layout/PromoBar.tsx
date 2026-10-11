'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

interface PromoBarProps {
  customMessage?: string;
}

export default function PromoBar({ customMessage }: PromoBarProps) {
  const [promoText, setPromoText] = useState<string | null>(() => {
    if (customMessage) return customMessage;
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('glowseoul_promo_text') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (customMessage) return;
    fetch('/api/admin/banners', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.banners) {
          const promoBanner = data.banners.find((b: any) => b.type === 'promo_bar' && b.isActive);
          if (promoBanner && promoBanner.title) {
            setPromoText(promoBanner.title);
            try {
              localStorage.setItem('glowseoul_promo_text', promoBanner.title);
            } catch {}
          } else {
            setPromoText(null);
            try {
              localStorage.removeItem('glowseoul_promo_text');
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [customMessage]);

  return (
    <div style={{
      background: 'var(--color-gradient-brand)',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600',
      padding: '7px 16px',
      textAlign: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        {promoText ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> {promoText}
          </span>
        ) : (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={14} /> Freeship toàn quốc cho đơn từ 399.000₫
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Nhập <strong>KBEAUTY10</strong> giảm ngay 10%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> 100% Mỹ phẩm Hàn Quốc chính hãng
            </span>
          </>
        )}
      </div>
    </div>
  );
}
