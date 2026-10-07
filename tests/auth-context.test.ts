import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Client AuthContext and Global Integration', () => {
  it('verifies AuthContext file exists and exports useAuth and AuthProvider', () => {
    const authContextPath = path.resolve(__dirname, '../src/context/AuthContext.tsx');
    expect(fs.existsSync(authContextPath)).toBe(true);
    const content = fs.readFileSync(authContextPath, 'utf-8');
    expect(content).toContain('useAuth');
    expect(content).toContain('AuthProvider');
    expect(content).toContain('login');
    expect(content).toContain('logout');
    expect(content).toContain('user');
    expect(content).toContain('role');
  });

  it('verifies root layout wraps children with AuthProvider', () => {
    const layoutPath = path.resolve(__dirname, '../src/app/layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toContain('AuthProvider');
    expect(content).toContain('@/context/AuthContext');
  });
});
