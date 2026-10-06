import { describe, it, expect } from 'vitest';
import { getDiscountBadgeText } from '../src/components/product/ProductCard';

describe('Product Card Helper', () => {
  it('returns discount tag string when original price is higher', () => {
    expect(getDiscountBadgeText(350000, 280000)).toBe('-20%');
  });

  it('returns null when there is no discount', () => {
    expect(getDiscountBadgeText(undefined, 280000)).toBe(null);
    expect(getDiscountBadgeText(280000, 280000)).toBe(null);
  });
});
