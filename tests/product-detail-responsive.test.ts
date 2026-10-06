import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Product Detail Responsive Layout', () => {
  it('contains responsive-grid-1 or single column stacking rule for mobile', () => {
    const detailPath = path.resolve(__dirname, '../src/app/products/[id]/page.tsx');
    const content = fs.readFileSync(detailPath, 'utf-8');
    expect(content).toContain('responsive-grid-1');
  });
});
