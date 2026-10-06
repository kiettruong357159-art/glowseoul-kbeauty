import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Custom Slim Scrollbar Styling', () => {
  it('defines custom slim scrollbar rules in globals.css', () => {
    const cssPath = path.resolve(__dirname, '../src/app/globals.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('::-webkit-scrollbar');
    expect(content).toContain('::-webkit-scrollbar-thumb');
    expect(content).toContain('scrollbar-width: thin');
  });
});
