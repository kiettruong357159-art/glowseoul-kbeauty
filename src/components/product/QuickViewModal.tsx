'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ProductData } from './ProductCard';

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductData | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const imagesList: string[] = (() => {
    try {
      return JSON.parse(product.images);
    } catch {
      return ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'];
    }
  })();

  const mainImage = imagesList[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: mainImage,
        brand: product.brand,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal Dialog */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '750px',
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          zIndex: 111,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--color-bg)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          title="Đóng"
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '360px', background: '#f8f8f8' }}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="400px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            {product.brand}
          </span>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '10px',
            }}
          >
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', fontWeight: '700', marginBottom: '16px' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-subtle)', fontWeight: '400' }}>
              ({product.reviewCount} đánh giá từ người dùng)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '14px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'white',
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                -
              </button>
              <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: '700' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{ width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '10px 18px',
                fontSize: '14px',
                borderRadius: 'var(--radius-md)',
                background: added ? '#10B981' : 'var(--color-gradient-brand)',
              }}
            >
              {added ? (
                <>
                  <Check size={16} /> Đã thêm!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Thêm vào giỏ
                </>
              )}
            </button>
          </div>

          <Link
            href={`/products/${product.id}`}
            onClick={onClose}
            style={{
              marginTop: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--color-primary)',
            }}
          >
            <span>Xem chi tiết công dụng & thành phần</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
