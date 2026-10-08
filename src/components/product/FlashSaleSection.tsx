'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ShoppingBag, Eye, ArrowRight, Sparkles } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';
import FlashSaleProgressBar from '@/components/ui/FlashSaleProgressBar';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export interface FlashSaleItemData {
  id: string;
  flashSaleId: string;
  productId: string;
  discountPrice: number;
  limitQuantity: number;
  soldQuantity: number;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number | null;
    images: string;
    rating: number;
    reviewCount: number;
    category: string;
    skinType: string;
    stock: number;
  };
}

export interface FlashSaleCampaign {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  items: FlashSaleItemData[];
}

export default function FlashSaleSection({
  onQuickView,
}: {
  onQuickView?: (product: any) => void;
}) {
  const { addItem } = useCart();
  const { showSuccess } = useToast();
  const [campaign, setCampaign] = useState<FlashSaleCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const fetchActiveCampaign = useCallback(async () => {
    try {
      const res = await fetch('/api/flash-sales/active');
      const data = await res.json();
      if (data.success && data.status === 'active' && data.flashSale) {
        setCampaign(data.flashSale);
      } else {
        setCampaign(null);
      }
    } catch (err) {
      console.error('Failed to load flash sale:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveCampaign();
  }, [fetchActiveCampaign]);

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Đang tải ưu đãi Flash Sale...
      </div>
    );
  }

  if (!campaign || isExpired || campaign.items.length === 0) {
    return null; // Don't render section if no active campaign
  }

  const handleAddToCart = (e: React.MouseEvent, item: FlashSaleItemData) => {
    e.preventDefault();
    e.stopPropagation();

    const isSoldOut = item.soldQuantity >= item.limitQuantity;
    if (isSoldOut) return;

    let mainImg = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
    try {
      const parsed = JSON.parse(item.product.images);
      if (Array.isArray(parsed) && parsed[0]) mainImg = parsed[0];
    } catch {}

    addItem(
      {
        id: item.product.id,
        name: item.product.name,
        price: item.discountPrice, // Use flash sale price!
        originalPrice: item.product.price,
        image: mainImg,
      },
      1
    );

    showSuccess(`Đã thêm deal Flash Sale "${item.product.name}" vào giỏ hàng!`);
  };

  return (
    <section
      style={{
        padding: '50px 0',
        background: 'linear-gradient(180deg, #fff2f4 0%, #ffffff 100%)',
        borderTop: '1px solid #ffe3e8',
        borderBottom: '1px solid #ffe3e8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Flash Sale Header Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '32px',
            padding: '24px 28px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 107, 129, 0.25)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #ff6b81 0%, #fa5252 100%)',
                color: '#ffffff',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.35)',
                marginBottom: '10px',
              }}
            >
              <Zap size={14} fill="#ffffff" />
              <span>Giờ Vàng Săn Deal</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                margin: '4px 0 6px',
                lineHeight: 1.25,
              }}
            >
              {campaign.title}
            </h2>

            {campaign.description && (
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
                {campaign.description}
              </p>
            )}
          </div>

          <div
            style={{
              padding: '12px 18px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CountdownTimer
              targetDate={campaign.endTime}
              label="Kết thúc trong"
              onExpire={() => setIsExpired(true)}
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {campaign.items.map((item) => {
            const product = item.product;
            const isSoldOut = item.soldQuantity >= item.limitQuantity;

            let mainImg = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
            try {
              const parsed = JSON.parse(product.images);
              if (Array.isArray(parsed) && parsed[0]) mainImg = parsed[0];
            } catch {}

            // Calculate savings & percent off based on product.price vs discountPrice
            const pctOff = Math.round(((product.price - item.discountPrice) / product.price) * 100);

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--color-primary-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {/* Discount Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 2,
                    background: 'linear-gradient(135deg, #fa5252 0%, #ff6b81 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    padding: '4px 9px',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 2px 8px rgba(250, 82, 82, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Zap size={11} fill="#ffffff" />
                  GIẢM {pctOff}%
                </div>

                {/* Image Wrap */}
                <Link
                  href={`/products/${product.id}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    backgroundColor: 'var(--color-bg)',
                    display: 'block',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={mainImg}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      filter: isSoldOut ? 'grayscale(70%)' : 'none',
                    }}
                  />
                  {isSoldOut && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      HẾT SUẤT
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        letterSpacing: '0.5px',
                        marginBottom: '4px',
                      }}
                    >
                      {product.brand}
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.925rem',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          margin: '0 0 10px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '2.8em',
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price Box */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--color-primary-hover)',
                        }}
                      >
                        {formatPrice(item.discountPrice)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-text-subtle)',
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Heat Progress Bar */}
                    <FlashSaleProgressBar
                      soldQuantity={item.soldQuantity}
                      limitQuantity={item.limitQuantity}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={isSoldOut}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        backgroundColor: isSoldOut ? 'var(--color-border)' : 'var(--color-primary)',
                        color: isSoldOut ? 'var(--color-text-subtle)' : '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: isSoldOut ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSoldOut) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSoldOut) e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      }}
                    >
                      <ShoppingBag size={15} />
                      {isSoldOut ? 'Hết suất' : 'Săn ngay'}
                    </button>

                    {onQuickView && (
                      <button
                        onClick={() => onQuickView(product)}
                        title="Xem nhanh"
                        style={{
                          padding: '10px 12px',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
