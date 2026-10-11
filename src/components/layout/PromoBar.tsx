'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PromoBarProps {
  customMessage?: string;
  initialMessage?: string | null;
}

export default function PromoBar({ customMessage, initialMessage }: PromoBarProps) {
  const [promoText, setPromoText] = useState<string | null>(() => {
    if (customMessage) return customMessage;
    if (initialMessage !== undefined && initialMessage !== null) return initialMessage;
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

  if (!promoText) {
    return null;
  }

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> {promoText}
        </span>
      </div>
    </div>
  );
}
