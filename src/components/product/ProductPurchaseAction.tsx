'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductPurchaseAction({
  product,
  mainImage,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    brand: string;
  };
  mainImage: string;
}) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
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
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
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
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Quantity & Add to Cart */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            background: 'white',
            padding: '2px',
          }}
        >
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            style={{ width: '40px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--color-text-muted)' }}
          >
            -
          </button>
          <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '800', fontSize: '15px' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            style={{ width: '40px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--color-text-muted)' }}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="btn-outline"
          style={{
            flex: 1,
            padding: '12px 24px',
            fontSize: '15px',
            background: added ? '#10B981' : 'white',
            borderColor: added ? '#10B981' : 'var(--color-primary)',
            color: added ? 'white' : 'var(--color-primary)',
          }}
        >
          {added ? (
            <>
              <Check size={18} /> Đã thêm vào giỏ!
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> Thêm vào giỏ hàng
            </>
          )}
        </button>
      </div>

      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '15px 24px',
          fontSize: '16px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '16px',
        }}
      >
        <span>Mua ngay (Giao hàng tận nơi)</span>
        <ArrowRight size={18} />
      </button>

      {/* Trust reassurance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          justifyContent: 'center',
        }}
      >
        <ShieldCheck size={16} color="#10B981" />
        <span>Cam kết 100% chính hãng có tem phụ tiếng Việt • Đổi trả 7 ngày</span>
      </div>
    </div>
  );
}
