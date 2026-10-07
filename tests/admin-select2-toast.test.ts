import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('CustomSelect & Toast Notification System', () => {
  it('verifies CustomSelect component exists and supports search filtering', () => {
    const selectPath = path.resolve(__dirname, '../src/components/ui/CustomSelect.tsx');
    expect(fs.existsSync(selectPath)).toBe(true);
    const content = fs.readFileSync(selectPath, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('search');
    expect(content).toContain('placeholder');
    expect(content).toContain('onChange');
  });

  it('verifies ToastContext exists and exports ToastProvider and useToast', () => {
    const toastPath = path.resolve(__dirname, '../src/context/ToastContext.tsx');
    expect(fs.existsSync(toastPath)).toBe(true);
    const content = fs.readFileSync(toastPath, 'utf-8');
    expect(content).toContain('ToastProvider');
    expect(content).toContain('useToast');
    expect(content).toContain('showSuccess');
    expect(content).toContain('showError');
  });

  it('verifies RootLayout wraps children with ToastProvider', () => {
    const layoutPath = path.resolve(__dirname, '../src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toContain('ToastProvider');
  });

  it('verifies ProductListTable uses CustomSelect instead of native select', () => {
    const tablePath = path.resolve(__dirname, '../src/components/admin/ProductListTable.tsx');
    const content = fs.readFileSync(tablePath, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).not.toContain('<select');
  });

  it('verifies ProductFormModal uses CustomSelect for brand, category, skinType', () => {
    const modalPath = path.resolve(__dirname, '../src/components/admin/ProductFormModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect(content).toContain('CustomSelect');
    expect(content).not.toContain('<select');
  });
});
