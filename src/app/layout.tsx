import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

export const metadata: Metadata = {
  title: 'GlowSeoul - Mỹ Phẩm K-Beauty Hàn Quốc Chính Hãng',
  description:
    'Thiên đường mỹ phẩm K-Beauty chuẩn Hàn hàng đầu Việt Nam. Tinh chất ốc sên COSRX, kem chống nắng Beauty of Joseon, mặt nạ môi Laneige chính hãng 100%.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <StorefrontLayout>{children}</StorefrontLayout>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
