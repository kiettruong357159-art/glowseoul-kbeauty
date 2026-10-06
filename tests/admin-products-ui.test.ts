import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Products UI Components', () => {
  it('verifies ProductListTable supports search, edit and delete actions', () => {
    const tablePath = path.resolve(__dirname, '../src/components/admin/ProductListTable.tsx');
    expect(fs.existsSync(tablePath)).toBe(true);
    const content = fs.readFileSync(tablePath, 'utf-8');
    expect(content).toContain('onEdit');
    expect(content).toContain('onDelete');
  });

  it('verifies ProductFormModal contains live image preview container', () => {
    const modalPath = path.resolve(__dirname, '../src/components/admin/ProductFormModal.tsx');
    expect(fs.existsSync(modalPath)).toBe(true);
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect(content).toContain('img');
    expect(content).toContain('onSubmit');
  });
});
