import { describe, it, expect } from 'vitest';
import { formatPrice, calculateDiscount } from '../src/lib/utils';

describe('Price and Discount Utility Functions', () => {
  it('formats number to Vietnamese Dong currency format', () => {
    expect(formatPrice(285000)).toBe('285.000 ₫');
  });

  it('calculates discount percentage correctly', () => {
    expect(calculateDiscount(350000, 280000)).toBe(20);
  });
});
