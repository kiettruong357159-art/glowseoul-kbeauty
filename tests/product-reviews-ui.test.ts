import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Product Reviews & Rating UI Component', () => {
  it('verifies ProductReviewsSection component contains scorecard, filters, and modal', () => {
    const compPath = path.resolve(__dirname, '../src/components/product/ProductReviewsSection.tsx');
    expect(fs.existsSync(compPath)).toBe(true);
    const content = fs.readFileSync(compPath, 'utf-8');

    // Scorecard & Summary
    expect(content).toContain('Đánh Giá Từ Khách Hàng Thực Tế');
    expect(content).toContain('Trải Nghiệm & Cảm Nhận K-Beauty');
    expect(content).toContain('stats.average');
    expect(content).toContain('stats.total');
    expect(content).toContain('stats.counts');

    // Filters
    expect(content).toContain('filterRating');
    expect(content).toContain('filterSkinType');
    expect(content).toContain('Tất cả số sao');
    expect(content).toContain('Loại da:');

    // Modal & Interactive Stars
    expect(content).toContain('isModalOpen');
    expect(content).toContain('Viết Đánh Giá Sản Phẩm');
    expect(content).toContain('formRating');
    expect(content).toContain('formHoverRating');
    expect(content).toContain('handleSubmitReview');
    expect(content).toContain('Đã mua hàng');
  });

  it('verifies ProductDetailPage integrates ProductReviewsSection', () => {
    const pagePath = path.resolve(__dirname, '../src/app/products/[id]/page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('import ProductReviewsSection');
    expect(content).toContain('<ProductReviewsSection');
    expect(content).toContain('productId={product.id}');
  });

  it('verifies ProductPurchaseAction includes Wishlist heart toggle button', () => {
    const actionPath = path.resolve(__dirname, '../src/components/product/ProductPurchaseAction.tsx');
    expect(fs.existsSync(actionPath)).toBe(true);
    const content = fs.readFileSync(actionPath, 'utf-8');

    expect(content).toContain('handleToggleWishlist');
    expect(content).toContain('/api/account/wishlist');
    expect(content).toContain('isFavorited');
    expect(content).toContain('<Heart');
  });
});
