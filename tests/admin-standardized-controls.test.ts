import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Standardized Search, Filter & Add Controls across Admin Pages', () => {
  it('verifies CategoryManager implements the standard control bar layout with search, CustomSelect filter, and add button', () => {
    const file = path.resolve(__dirname, '../src/components/admin/CategoryManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('Search');
    expect(content).toContain('Plus');
    expect(content).toContain('maxWidth: \'360px\'');
    expect(content).toContain('btn-primary');
    expect(content).toContain('AlertCircle');
    expect(content).toContain('Pagination');
  });

  it('verifies BrandManager implements the standard control bar layout with search, CustomSelect filter, and add button', () => {
    const file = path.resolve(__dirname, '../src/components/admin/BrandManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('Search');
    expect(content).toContain('Plus');
    expect(content).toContain('maxWidth: \'360px\'');
    expect(content).toContain('btn-primary');
    expect(content).toContain('AlertCircle');
    expect(content).toContain('Pagination');
  });

  it('verifies CouponManager implements the standard control bar layout with search, CustomSelect filter, and add button', () => {
    const file = path.resolve(__dirname, '../src/components/admin/CouponManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('Search');
    expect(content).toContain('Plus');
    expect(content).toContain('maxWidth: \'360px\'');
    expect(content).toContain('btn-primary');
    expect(content).toContain('AlertCircle');
    expect(content).toContain('Pagination');
  });

  it('verifies OrderManager implements the standard control bar layout with search, CustomSelect filters, sorting, alert circle, and pagination', () => {
    const file = path.resolve(__dirname, '../src/components/admin/OrderManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('Search');
    expect(content).toContain('maxWidth: \'360px\'');
    expect(content).toContain('AlertCircle');
    expect(content).toContain('Pagination');
    expect(content).toContain('sortBy');
    expect(content).toContain('RotateCw');
  });
});
