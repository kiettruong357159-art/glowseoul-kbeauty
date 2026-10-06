'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export function getDiscountBadgeText(originalPrice?: number | null, price?: number): string | null {
  if (!originalPrice || !price || originalPrice <= price) return null;
  const pct = calculateDiscount(originalPrice, price);
  return `-${pct}%`;
}

export interface ProductData {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  images: string; // JSON array string
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  category: string;
  skinType: string;
}

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductData;
  onQuickView?: (product: ProductData) => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imagesList: string[] = (() => {
    try {
      return JSON.parse(product.images);
    } catch {
      return ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'];
    }
  })();

  const mainImage = imagesList[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
  const discountText = getDiscountBadgeText(product.originalPrice, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: mainImage,
      brand: product.brand,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'none',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      }}
    >
      {/* Badges Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {product.isBestSeller && (
          <span className="badge badge-bestseller">Best Seller</span>
        )}
        {product.isNew && (
          <span className="badge badge-new">New</span>
        )}
        {discountText && (
          <span className="badge badge-sale">{discountText}</span>
        )}
      </div>

      {/* Image Container with Link */}
      <Link
        href={`/products/${product.id}`}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 Aspect ratio
          overflow: 'hidden',
          background: '#f9f6f4',
          display: 'block',
        }}
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Quick View Button floating on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              color: 'var(--color-text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.25s ease',
            }}
            title="Xem nhanh"
          >
            <Eye size={18} />
          </button>
        )}
      </Link>

      {/* Details Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              letterSpacing: '0.5px',
            }}
          >
            {product.brand}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-subtle)', fontWeight: '400', fontSize: '11px' }}>
              ({product.reviewCount})
            </span>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          style={{
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '1.4',
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '38px',
          }}
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing and Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: added ? '#10B981' : 'var(--color-primary-light)',
              color: added ? 'white' : 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: added ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
            }}
            title="Thêm vào giỏ"
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
