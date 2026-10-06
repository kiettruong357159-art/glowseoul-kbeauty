import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import ProductTabs from '@/components/product/ProductTabs';
import ProductPurchaseAction from '@/components/product/ProductPurchaseAction';
import ProductCard from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy - GlowSeoul',
    };
  }

  return {
    title: `${product.name} | GlowSeoul K-Beauty Chính Hãng`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const imagesList: string[] = (() => {
    try {
      return JSON.parse(product.images);
    } catch {
      return ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'];
    }
  })();

  const mainImage = imagesList[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

  // Fetch related products (same category or brand)
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ category: product.category }, { brand: product.brand }],
    },
    take: 4,
  });

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginBottom: '32px',
          }}
        >
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/products">Sản phẩm</Link>
          <ChevronRight size={14} />
          <Link href={`/products?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text-main)', fontWeight: '600', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) 1.2fr',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Gallery */}
          <ProductGallery images={imagesList} />

          {/* Right: Info and Buying Box */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {product.brand}
              </span>

              {product.isBestSeller && (
                <span className="badge badge-bestseller">Best Seller</span>
              )}
            </div>

            <h1
              style={{
                fontSize: '26px',
                fontWeight: '800',
                lineHeight: '1.3',
                marginBottom: '14px',
                letterSpacing: '-0.5px',
              }}
            >
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#f59e0b',
                fontWeight: '700',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--color-text-subtle)', fontWeight: '400' }}>
                ({product.reviewCount} lượt đánh giá từ khách hàng)
              </span>
            </div>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '30px', fontWeight: '800', color: 'var(--color-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '18px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Purchase Action Box */}
            <ProductPurchaseAction
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                brand: product.brand,
              }}
              mainImage={mainImage}
            />
          </div>
        </div>

        {/* Detailed Tabs: Benefits, Ingredients & Routine */}
        <ProductTabs
          description={product.description}
          ingredients={product.ingredients}
          usage={product.usage}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>
                Khám Phá Thêm
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>
                Sản Phẩm Cùng Bộ Sưu Tập
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
