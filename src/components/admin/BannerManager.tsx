'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Sparkles, Check, Save, Eye } from 'lucide-react';

interface BannerItem {
  id: string;
  type: string; // 'hero' | 'promo_bar'
  title: string;
  subtitle?: string | null;
  badgeText?: string | null;
  linkUrl?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Promo bar state
  const [promoBarId, setPromoBarId] = useState('');
  const [promoText, setPromoText] = useState('');
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Hero banner state
  const [heroId, setHeroId] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [savingHero, setSavingHero] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  const loadBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.banners) {
        setBanners(data.banners);
        const promo = data.banners.find((b: BannerItem) => b.type === 'promo_bar');
        if (promo) {
          setPromoBarId(promo.id);
          setPromoText(promo.title);
        }

        const hero = data.banners.find((b: BannerItem) => b.type === 'hero');
        if (hero) {
          setHeroId(hero.id);
          setHeroBadge(hero.badgeText || '');
          setHeroTitle(hero.title);
          setHeroSubtitle(hero.subtitle || '');
        }
      }
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSavePromoBar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoBarId) return;
    setSavingPromo(true);
    setPromoSuccess(false);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: promoBarId,
          title: promoText.trim(),
        }),
      });
      if (res.ok) {
        setPromoSuccess(true);
        setTimeout(() => setPromoSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving promo banner:', err);
    } finally {
      setSavingPromo(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroId) return;
    setSavingHero(true);
    setHeroSuccess(false);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: heroId,
          badgeText: heroBadge.trim(),
          title: heroTitle.trim(),
          subtitle: heroSubtitle.trim(),
        }),
      });
      if (res.ok) {
        setHeroSuccess(true);
        setTimeout(() => setHeroSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving hero banner:', err);
    } finally {
      setSavingHero(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Đang tải cấu hình banners...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Promo Bar Config */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          background: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Megaphone size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
            Thanh thông báo đầu trang (Promo Top Bar)
          </h3>
        </div>

        {/* Live Preview Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={14} /> Xem trước thực tế trên đầu website:
          </div>
          <div
            style={{
              background: 'var(--color-gradient-brand)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>{promoText || 'Nhập thông điệp khuyến mại...'}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePromoBar} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            required
            value={promoText}
            onChange={(e) => setPromoText(e.target.value)}
            placeholder="VD: Freeship toàn quốc đơn từ 399K • Nhập KBEAUTY10 giảm 10%"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={savingPromo}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {savingPromo ? 'Đang lưu...' : promoSuccess ? <><Check size={16} /> Đã cập nhật</> : <><Save size={16} /> Lưu thay đổi</>}
          </button>
        </form>
      </div>

      {/* 2. Hero Banner Config */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          background: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={20} color="#ff6b81" />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
            Banner chính trang chủ (Hero Banner)
          </h3>
        </div>

        {/* Live Preview Card */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={14} /> Xem trước thông điệp trên Hero Card:
          </div>
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #fff5f6 0%, #fff 100%)',
              border: '1px solid rgba(255, 107, 129, 0.2)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'white',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--color-primary)',
                marginBottom: '12px',
                boxShadow: '0 2px 6px rgba(255, 107, 129, 0.1)',
              }}
            >
              <Sparkles size={13} />
              <span>{heroBadge || 'K-Beauty Trending 2026'}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-main)', marginBottom: '8px' }}>
              {heroTitle || 'Đánh Thức Làn Da Sáng Mịn Căng Bóng Chuẩn Hàn'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '600px', lineHeight: '1.5' }}>
              {heroSubtitle || 'Khám phá các sản phẩm hot nhất...'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Dòng huy hiệu nhỏ (Badge pill)
            </label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="VD: K-Beauty Trending 2026 • 100% Chính Hãng"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Tiêu đề chính Hero (Headline) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="VD: Đánh Thức Làn Da Sáng Mịn Căng Bóng Chuẩn Hàn"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              Đoạn văn giới thiệu ngắn (Subtitle)
            </label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="VD: Khám phá bộ sưu tập tinh chất ốc sên COSRX, kem chống nắng BOJ..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingHero}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {savingHero ? 'Đang lưu...' : heroSuccess ? <><Check size={16} /> Đã cập nhật</> : <><Save size={16} /> Lưu Hero Banner</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
