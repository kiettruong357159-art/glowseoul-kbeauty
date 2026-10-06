import React from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function PromoBar() {
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
          <Truck size={14} /> Freeship toàn quốc cho đơn từ 399.000₫
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> Nhập <strong>KBEAUTY10</strong> giảm ngay 10%
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} /> 100% Mỹ phẩm Hàn Quốc chính hãng
        </span>
      </div>
    </div>
  );
}
