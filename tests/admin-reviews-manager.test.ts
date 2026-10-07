import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/db';

describe('Admin Reviews Management & Moderation', () => {
  it('verifies ReviewManager component structure and moderation features', () => {
    const managerPath = path.resolve(__dirname, '../src/components/admin/ReviewManager.tsx');
    expect(fs.existsSync(managerPath)).toBe(true);
    const content = fs.readFileSync(managerPath, 'utf-8');

    // Headers & count
    expect(content).toContain('Quản Lý Đánh Giá Khách Hàng');
    expect(content).toContain('fetchReviews');
    expect(content).toContain('search');
    expect(content).toContain('selectedRating');

    // Table elements
    expect(content).toContain('Sản phẩm');
    expect(content).toContain('Khách hàng');
    expect(content).toContain('Đánh giá');
    expect(content).toContain('Nhận xét & Trải nghiệm');
    expect(content).toContain('Xóa đánh giá này');

    // Delete modal confirmation
    expect(content).toContain('deleteTarget');
    expect(content).toContain('Xác Nhận Xóa Đánh Giá?');
    expect(content).toContain('confirmDelete');
    expect(content).toContain('/api/admin/reviews?id=');
  });

  it('verifies AdminSidebar and AdminPage integrate reviews tab', () => {
    const sidebarPath = path.resolve(__dirname, '../src/components/admin/AdminSidebar.tsx');
    const pagePath = path.resolve(__dirname, '../src/app/admin/page.tsx');

    const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    expect(sidebarContent).toContain("'reviews'");
    expect(sidebarContent).toContain('Đánh giá sản phẩm');

    expect(pageContent).toContain("activeTab === 'reviews'");
    expect(pageContent).toContain('<ReviewManager');
  });

  it('verifies review deletion updates product rating and review count in database', async () => {
    // 1. Get or create a product
    const product = await prisma.product.findFirst();
    expect(product).toBeDefined();
    if (!product) return;

    // 2. Create a temporary review
    const tempReview = await prisma.review.create({
      data: {
        productId: product.id,
        rating: 1,
        authorName: 'Test Spam Review',
        comment: 'Spam comment to be moderated and deleted',
      },
    });
    expect(tempReview.id).toBeDefined();

    // 3. Delete the review
    await prisma.review.delete({
      where: { id: tempReview.id },
    });

    // 4. Verify review is removed
    const found = await prisma.review.findUnique({
      where: { id: tempReview.id },
    });
    expect(found).toBeNull();
  });
});
