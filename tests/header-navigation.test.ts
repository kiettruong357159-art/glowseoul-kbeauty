import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Header Streamlined Navigation and Product Dropdown', () => {
  it('verifies Header contains streamlined navigation links, product dropdown, and correct categories', () => {
    const headerPath = path.resolve(__dirname, '../src/components/layout/Header.tsx');
    expect(fs.existsSync(headerPath)).toBe(true);
    const content = fs.readFileSync(headerPath, 'utf-8');

    // Brand logo
    expect(content).toContain('Glow');
    expect(content).toContain('Seoul');

    // Streamlined 3 main nav items
    expect(content).toContain('Trang chủ');
    expect(content).toContain('Sản phẩm');
    expect(content).toContain('Trắc nghiệm Routine');

    // Dropdown elements
    expect(content).toContain('isProductMenuOpen');
    expect(content).toContain('header-dropdown-menu');
    expect(content).toContain('header-dropdown-item');
    expect(content).toContain('Tất cả sản phẩm');
    expect(content).toContain('Serum & Ampoule');
    expect(content).toContain('Kem chống nắng');
    expect(content).toContain('Mặt nạ dưỡng da');

    // Links
    expect(content).toContain('href="/products"');
    expect(content).toContain('href="/products?category=serum"');
    expect(content).toContain('href="/products?category=sunscreen"');
    expect(content).toContain('href="/products?category=mask"');
    expect(content).toContain('href="/quiz"');
    expect(content).toContain('href="/account"');

    // Auth & Actions
    expect(content).toContain('useCart');
    expect(content).toContain('useAuth');
    expect(content).toContain('Đăng nhập');
  });
});
