import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Separate Category and Brand Managers', () => {
  it('verifies AdminSidebar has dedicated menu items for categories and brands', () => {
    const sidebarPath = path.resolve(__dirname, '../src/components/admin/AdminSidebar.tsx');
    expect(fs.existsSync(sidebarPath)).toBe(true);
    const content = fs.readFileSync(sidebarPath, 'utf-8');
    expect(content).toContain('categories');
    expect(content).toContain('brands');
    expect(content).toContain('Danh mục');
    expect(content).toContain('Thương hiệu');
  });

  it('verifies dedicated CategoryManager component exists with table, search, and pagination', () => {
    const catManagerPath = path.resolve(__dirname, '../src/components/admin/CategoryManager.tsx');
    expect(fs.existsSync(catManagerPath)).toBe(true);
    const content = fs.readFileSync(catManagerPath, 'utf-8');
    expect(content).toContain('CategoryManager');
    expect(content).toContain('<table');
    expect(content).toContain('Pagination');
    expect(content).toContain('searchTerm');
  });

  it('verifies dedicated BrandManager component exists with table, search, and pagination', () => {
    const brandManagerPath = path.resolve(__dirname, '../src/components/admin/BrandManager.tsx');
    expect(fs.existsSync(brandManagerPath)).toBe(true);
    const content = fs.readFileSync(brandManagerPath, 'utf-8');
    expect(content).toContain('BrandManager');
    expect(content).toContain('<table');
    expect(content).toContain('Pagination');
    expect(content).toContain('searchTerm');
  });

  it('verifies Admin page incorporates both CategoryManager and BrandManager', () => {
    const adminPagePath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    expect(fs.existsSync(adminPagePath)).toBe(true);
    const content = fs.readFileSync(adminPagePath, 'utf-8');
    expect(content).toContain('CategoryManager');
    expect(content).toContain('BrandManager');
    expect(content).toContain("'categories'");
    expect(content).toContain("'brands'");
  });
});
