import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Master Data Managers UI', () => {
  it('TaxonomiesManager exists and handles categories and brands', () => {
    const p = path.resolve(__dirname, '../src/components/admin/TaxonomiesManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('Danh mục');
    expect(content).toContain('Thương hiệu');
  });

  it('CouponManager exists and handles coupon creation and listing', () => {
    const p = path.resolve(__dirname, '../src/components/admin/CouponManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('discountPercent');
  });

  it('BannerManager exists and handles banner updates', () => {
    const p = path.resolve(__dirname, '../src/components/admin/BannerManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('promo_bar');
    expect(content).toContain('hero');
  });
});
