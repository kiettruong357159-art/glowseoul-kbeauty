import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import PromoBar from '@/components/layout/PromoBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'GlowSeoul - Mỹ Phẩm K-Beauty Hàn Quốc Chính Hãng',
  description:
    'Thiên đường mỹ phẩm K-Beauty chuẩn Hàn hàng đầu Việt Nam. Tinh chất ốc sên COSRX, kem chống nắng Beauty of Joseon, mặt nạ môi Laneige chính hãng 100%.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <PromoBar />
          <Header />
          <CartDrawer />
          <main style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
