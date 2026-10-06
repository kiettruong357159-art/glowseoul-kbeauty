import { describe, it, expect } from 'vitest';
import { buildProductFilterQuery } from '../src/lib/filter';

describe('Catalog Filter Query Builder', () => {
  it('builds prisma where clause matching category and skinType', () => {
    const query = buildProductFilterQuery({ category: 'serum', skinType: 'oily' });
    expect(query.where.category).toBe('serum');
    expect(query.where.skinType).toBe('oily');
  });

  it('filters by brand and price range', () => {
    const query = buildProductFilterQuery({ brand: 'COSRX', minPrice: '100000', maxPrice: '300000' });
    expect(query.where.brand).toBe('COSRX');
    expect(query.where.price).toEqual({ gte: 100000, lte: 300000 });
  });

  it('handles search query for product name or ingredients', () => {
    const query = buildProductFilterQuery({ q: 'Centella' });
    expect(query.where.OR).toBeDefined();
    expect(query.where.OR).toEqual([
      { name: { contains: 'Centella' } },
      { ingredients: { contains: 'Centella' } },
      { brand: { contains: 'Centella' } },
    ]);
  });
});
