'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PromoBar from '@/components/layout/PromoBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar />
      <Header />
      <CartDrawer />
      <main style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</main>
      <Footer />
    </>
  );
}
