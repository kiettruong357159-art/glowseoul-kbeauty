import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Master Data Models', () => {
  it('should query categories, brands, coupons, and banners from sqlite', async () => {
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    const coupons = await prisma.coupon.findMany();
    const banners = await prisma.banner.findMany();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
    expect(Array.isArray(banners)).toBe(true);
    expect(banners.length).toBeGreaterThan(0);
  });
});
