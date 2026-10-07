'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Check, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

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
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    fetch('/api/account/wishlist')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.productIds) {
          setIsFavorited(data.productIds.includes(product.id));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [user, product.id]);

  const handleToggleWishlist = async () => {
    if (!user) {
      showInfo('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');
      return;
    }

    setWishlistLoading(true);
    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorited(data.favorited);
        showSuccess(data.message || (data.favorited ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích'));
      } else {
        showError(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      showError('Không thể cập nhật danh sách yêu thích');
    } finally {
      setWishlistLoading(false);
    }
  };

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
      {/* Quantity & Add to Cart & Wishlist */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
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
            padding: '12px 20px',
            fontSize: '15px',
            background: added ? '#10B981' : 'white',
            borderColor: added ? '#10B981' : 'var(--color-primary)',
            color: added ? 'white' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {added ? (
            <>
              <Check size={18} /> Đã thêm vào giỏ!
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> Thêm vào giỏ
            </>
          )}
        </button>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          title={isFavorited ? 'Bỏ yêu thích' : 'Lưu vào danh sách yêu thích'}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid',
            borderColor: isFavorited ? '#ef4444' : 'var(--color-border)',
            background: isFavorited ? '#fee2e2' : 'white',
            color: isFavorited ? '#ef4444' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={20} fill={isFavorited ? '#ef4444' : 'none'} />
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
