import { describe, it, expect } from 'vitest';
import HeroBanner from '../src/components/home/HeroBanner';
import CategoryGrid from '../src/components/home/CategoryGrid';
import BrandShowcase from '../src/components/home/BrandShowcase';
import SkinTypeSelector from '../src/components/home/SkinTypeSelector';

describe('Homepage Responsive Components', () => {
  it('exports all homepage sections as valid components', () => {
    expect(typeof HeroBanner).toBe('function');
    expect(typeof CategoryGrid).toBe('function');
    expect(typeof BrandShowcase).toBe('function');
    expect(typeof SkinTypeSelector).toBe('function');
  });
});
