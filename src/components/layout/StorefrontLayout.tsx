'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PromoBar from '@/components/layout/PromoBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  initialPromoText?: string | null;
}

export default function StorefrontLayout({ children, initialPromoText }: StorefrontLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar initialMessage={initialPromoText} />
      <Header />
      <CartDrawer />
      <main style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</main>
      <Footer />
    </>
  );
}
