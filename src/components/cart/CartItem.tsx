'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItemType, useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        padding: '14px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
        alignItems: 'center',
      }}
    >
      {/* Product Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '70px',
          height: '70px',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
          flexShrink: 0,
        }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="70px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Info & Quantity */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {item.brand && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {item.brand}
          </span>
        )}
        <h4
          style={{
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: '2px 0 6px',
          }}
          title={item.name}
        >
          {item.name}
        </h4>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--color-primary)',
            }}
          >
            {formatPrice(item.price)}
          </span>

          {/* Quantity Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              background: 'white',
            }}
          >
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
              }}
              title="Giảm số lượng"
            >
              <Minus size={12} />
            </button>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
              }}
              title="Tăng số lượng"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        style={{
          color: 'var(--color-text-subtle)',
          padding: '6px',
          borderRadius: '50%',
          transition: 'all 0.2s',
        }}
        title="Xóa khỏi giỏ hàng"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
