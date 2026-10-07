import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Customer Account Portal UI (/account)', () => {
  it('verifies /account page component contains orders, wishlist, and profile tabs', () => {
    const pagePath = path.resolve(__dirname, '../src/app/account/page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, 'utf-8');

    // Tabs
    expect(content).toContain("activeTab === 'orders'");
    expect(content).toContain("activeTab === 'wishlist'");
    expect(content).toContain("activeTab === 'profile'");

    // Orders tab
    expect(content).toContain('Đơn hàng của tôi');
    expect(content).toContain('Lịch Sử Đơn Hàng');
    expect(content).toContain('handleReorder');
    expect(content).toContain('/orders/');

    // Wishlist tab
    expect(content).toContain('Sản Phẩm Yêu Thích');
    expect(content).toContain('handleRemoveFromWishlist');
    expect(content).toContain('Thêm vào giỏ');

    // Profile tab
    expect(content).toContain('Thông Tin Cá Nhân');
    expect(content).toContain('handleUpdateProfile');
    expect(content).toContain('profileName');
    expect(content).toContain('profilePhone');
    expect(content).toContain('profileAddress');

    // Auth gate
    expect(content).toContain('Tài Khoản Khách Hàng');
    expect(content).toContain('/login?redirect=/account');
  });

  it('verifies Header and MobileNavDrawer link to /account and /quiz', () => {
    const headerPath = path.resolve(__dirname, '../src/components/layout/Header.tsx');
    const drawerPath = path.resolve(__dirname, '../src/components/layout/MobileNavDrawer.tsx');

    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    const drawerContent = fs.readFileSync(drawerPath, 'utf-8');

    // Account link
    expect(headerContent).toContain('href="/account"');
    expect(drawerContent).toContain('href="/account"');

    // Quiz link
    expect(headerContent).toContain('href="/quiz"');
    expect(drawerContent).toContain("'/quiz'");
  });
});
