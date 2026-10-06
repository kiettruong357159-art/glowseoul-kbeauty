import { describe, it, expect } from 'vitest';
import { parseIngredientsList } from '../src/components/product/ProductTabs';

describe('Ingredients Parser', () => {
  it('parses comma-separated ingredient string into formatted badges', () => {
    const raw = 'Centella Asiatica, Niacinamide 10%, Hyaluronic Acid';
    const list = parseIngredientsList(raw);
    expect(list).toEqual(['Centella Asiatica', 'Niacinamide 10%', 'Hyaluronic Acid']);
  });

  it('handles empty string gracefully', () => {
    expect(parseIngredientsList('')).toEqual([]);
  });
});
