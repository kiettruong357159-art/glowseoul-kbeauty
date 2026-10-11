'use client';

import React from 'react';
import Link from 'next/link';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/image-fallback';

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  sunscreen: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  toner: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
  mask: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
  cleanser: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  makeup: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
};

export interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
  image?: string | null;
  count?: string;
}

interface CategoryGridProps {
  categories?: CategoryItem[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;
  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>
              Danh Mục Yêu Thích
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.5px' }}>
              Khám Phá Theo Nhu Cầu
            </h2>
          </div>
          <Link href="/products" prefetch={true} style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>
            Xem tất cả →
          </Link>
        </div>

        <div
          className="responsive-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              prefetch={true}
              style={{
                position: 'relative',
                height: '180px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.3s ease',
              }}
            >
              <img
                src={cat.image || CATEGORY_DEFAULT_IMAGES[cat.slug] || DEFAULT_PRODUCT_IMAGE}
                alt={cat.name}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  color: 'white',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '2px' }}>
                  {cat.name}
                </h3>
                <span style={{ fontSize: '12px', opacity: 0.85 }}>
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
