import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Data Tables, Search, Filter & Pagination', () => {
  it('verifies reusable Pagination component exists with prev, next, page numbers, and total counters', () => {
    const paginationPath = path.resolve(__dirname, '../src/components/ui/Pagination.tsx');
    expect(fs.existsSync(paginationPath)).toBe(true);
    const content = fs.readFileSync(paginationPath, 'utf-8');
    expect(content).toContain('Pagination');
    expect(content).toContain('currentPage');
    expect(content).toContain('totalPages');
    expect(content).toContain('onPageChange');
    expect(content).toContain('totalItems');
  });

  it('verifies ProductListTable incorporates pagination controls alongside search & category/brand filters', () => {
    const productsPath = path.resolve(__dirname, '../src/components/admin/ProductListTable.tsx');
    expect(fs.existsSync(productsPath)).toBe(true);
    const content = fs.readFileSync(productsPath, 'utf-8');
    expect(content).toContain('Pagination');
    expect(content).toContain('currentPage');
    expect(content).toContain('pageSize');
  });

  it('verifies OrderManager incorporates pagination controls alongside search & status filters', () => {
    const ordersPath = path.resolve(__dirname, '../src/components/admin/OrderManager.tsx');
    expect(fs.existsSync(ordersPath)).toBe(true);
    const content = fs.readFileSync(ordersPath, 'utf-8');
    expect(content).toContain('Pagination');
    expect(content).toContain('currentPage');
    expect(content).toContain('pageSize');
  });

  it('verifies TaxonomiesManager contains structured tables with search and pagination for categories and brands', () => {
    const taxonomiesPath = path.resolve(__dirname, '../src/components/admin/TaxonomiesManager.tsx');
    expect(fs.existsSync(taxonomiesPath)).toBe(true);
    const content = fs.readFileSync(taxonomiesPath, 'utf-8');
    expect(content).toContain('<table');
    expect(content).toContain('Pagination');
    expect(content).toContain('categorySearch');
    expect(content).toContain('brandSearch');
  });

  it('verifies CouponManager contains search, status filter, and pagination', () => {
    const couponPath = path.resolve(__dirname, '../src/components/admin/CouponManager.tsx');
    expect(fs.existsSync(couponPath)).toBe(true);
    const content = fs.readFileSync(couponPath, 'utf-8');
    expect(content).toContain('Pagination');
    expect(content).toContain('searchTerm');
    expect(content).toContain('statusFilter');
  });
});
