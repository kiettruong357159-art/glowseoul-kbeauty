import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Pre-Push Pipeline & Code Rules Gateway Verification', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('phải có script kiểm tra quy chuẩn scripts/verify-code-rules.ts', () => {
    const scriptPath = path.join(rootDir, 'scripts', 'verify-code-rules.ts');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('checkImageResiliency');
    expect(content).toContain('checkEdgeMiddlewareProtection');
    expect(content).toContain('checkRouteSkeletons');
    expect(content).toContain('checkNoUnderscoreVariableCheats');
  });

  it('phải có script tự động cài hook scripts/setup-hooks.ts', () => {
    const scriptPath = path.join(rootDir, 'scripts', 'setup-hooks.ts');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('pre-push');
  });

  it('phải cấu hình đầy đủ các lệnh pipeline trong package.json', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    expect(pkg.scripts['check:types']).toBe('tsc --noEmit');
    expect(pkg.scripts['check:rules']).toBe('tsx scripts/verify-code-rules.ts');
    expect(pkg.scripts['verify']).toBe('npm run check:rules && npm run check:types && npm test');
    expect(pkg.scripts['pre-push']).toBe('npm run verify && npm run build');
    expect(pkg.scripts['prepare:hooks']).toBe('tsx scripts/setup-hooks.ts');
    expect(pkg.scripts['postinstall']).toContain('setup-hooks.ts');
  });

  it('phải có git hook .git/hooks/pre-push với đầy đủ 4 bước chốt chặn', () => {
    const hookPath = path.join(rootDir, '.git', 'hooks', 'pre-push');
    expect(fs.existsSync(hookPath)).toBe(true);
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('npm run check:rules');
    expect(content).toContain('npm run check:types');
    expect(content).toContain('npm test');
    expect(content).toContain('npm run build');
  });

  it('phải có GitHub Actions CI workflow .github/workflows/ci.yml', () => {
    const workflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf-8');
    expect(content).toContain('npm run check:rules');
    expect(content).toContain('npm run check:types');
    expect(content).toContain('npm test');
    expect(content).toContain('npm run build');
  });

  it('Edge Middleware phải bảo vệ cả hai tuyến /admin và /account', () => {
    const middlewarePath = path.join(rootDir, 'src', 'middleware.ts');
    expect(fs.existsSync(middlewarePath)).toBe(true);
    const content = fs.readFileSync(middlewarePath, 'utf-8');
    expect(content).toContain("pathname.startsWith('/admin')");
    expect(content).toContain("pathname.startsWith('/account')");
    expect(content).toContain("'/admin/:path*'");
    expect(content).toContain("'/account/:path*'");
  });
});
