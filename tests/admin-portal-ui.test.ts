import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Portal Structure', () => {
  it('contains Admin page file with tab controls for all 4 master data domains', () => {
    const adminPath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    expect(fs.existsSync(adminPath)).toBe(true);
    const content = fs.readFileSync(adminPath, 'utf-8');
    expect(content).toContain('products');
    expect(content).toContain('taxonomies');
    expect(content).toContain('coupons');
    expect(content).toContain('banners');
  });

  it('contains AdminHeader component with link back to storefront', () => {
    const headerPath = path.resolve(__dirname, '../src/components/admin/AdminHeader.tsx');
    expect(fs.existsSync(headerPath)).toBe(true);
    const content = fs.readFileSync(headerPath, 'utf-8');
    expect(content).toContain('GlowSeoul');
    expect(content).toContain('Về cửa hàng');
  });

  it('contains AdminStatsCards component with 4 master data counter tiles', () => {
    const statsPath = path.resolve(__dirname, '../src/components/admin/AdminStatsCards.tsx');
    expect(fs.existsSync(statsPath)).toBe(true);
    const content = fs.readFileSync(statsPath, 'utf-8');
    expect(content).toContain('productCount');
    expect(content).toContain('categoryCount');
    expect(content).toContain('brandCount');
    expect(content).toContain('couponCount');
  });
});
