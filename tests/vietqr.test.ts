import { describe, it, expect } from 'vitest';
import { generateVietQRUrl } from '../src/lib/vietqr';

describe('VietQR URL Generator', () => {
  it('generates compliant Napas247 VietQR image URL with order code and amount', () => {
    const url = generateVietQRUrl({
      bankId: 'MB',
      accountNo: '0388888888',
      accountName: 'GLOWSEOUL STORE',
      amount: 450000,
      orderCode: 'ORD-8823',
    });
    expect(url).toContain('https://img.vietqr.io/image/MB-0388888888-compact2.png');
    expect(url).toContain('amount=450000');
    expect(url).toContain('addInfo=ORD-8823');
    expect(url).toContain('accountName=GLOWSEOUL%20STORE');
  });
});
