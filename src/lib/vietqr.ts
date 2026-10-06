export interface VietQRConfig {
  bankId: string; // e.g. 'MB', 'VCB', 'TCB'
  accountNo: string;
  accountName: string;
  amount: number;
  orderCode: string;
}

export function generateVietQRUrl(config: VietQRConfig): string {
  const template = 'compact2';
  const encodedName = encodeURIComponent(config.accountName);
  const encodedInfo = encodeURIComponent(config.orderCode);

  return `https://img.vietqr.io/image/${config.bankId}-${config.accountNo}-${template}.png?amount=${config.amount}&addInfo=${encodedInfo}&accountName=${encodedName}`;
}
