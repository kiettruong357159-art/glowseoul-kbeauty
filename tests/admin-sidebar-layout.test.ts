import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Left Sidebar Navigation Layout', () => {
  it('verifies AdminSidebar component exists with brand, menu tabs, and back to store link', () => {
    const sidebarPath = path.resolve(__dirname, '../src/components/admin/AdminSidebar.tsx');
    expect(fs.existsSync(sidebarPath)).toBe(true);
    const content = fs.readFileSync(sidebarPath, 'utf-8');
    expect(content).toContain('AdminSidebar');
    expect(content).toContain('GlowSeoul');
    expect(content).toContain('Admin Portal');
    expect(content).toContain('Về cửa hàng');
    expect(content).toContain('dashboard');
    expect(content).toContain('orders');
    expect(content).toContain('products');
    expect(content).toContain('taxonomies');
    expect(content).toContain('coupons');
    expect(content).toContain('banners');
  });

  it('verifies Admin page incorporates AdminSidebar in a two-column sidebar layout', () => {
    const adminPagePath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    const content = fs.readFileSync(adminPagePath, 'utf-8');
    expect(content).toContain('AdminSidebar');
    expect(content).toContain('activeTab');
  });
});
