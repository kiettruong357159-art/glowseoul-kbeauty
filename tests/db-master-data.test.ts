import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Master Data Models', () => {
  it('should query categories, brands, coupons, and banners from sqlite', async () => {
    // @ts-expect-error - Models might not be on PrismaClient type until pushed
    const categories = await prisma.category.findMany();
    // @ts-expect-error - Models might not be on PrismaClient type until pushed
    const brands = await prisma.brand.findMany();
    // @ts-expect-error - Models might not be on PrismaClient type until pushed
    const coupons = await prisma.coupon.findMany();
    // @ts-expect-error - Models might not be on PrismaClient type until pushed
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
