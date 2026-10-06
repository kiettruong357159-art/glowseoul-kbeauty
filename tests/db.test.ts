import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Product Queries', () => {
  it('should query products from sqlite database', async () => {
    const products = await prisma.product.findMany();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
});
