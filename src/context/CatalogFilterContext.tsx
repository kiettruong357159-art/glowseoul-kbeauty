'use client';

import React, { createContext, useContext, useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface ActiveFilters {
  category: string;
  skinType: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  q: string;
}

interface CatalogFilterContextType {
  isPending: boolean;
  filters: ActiveFilters;
  setFilter: (key: keyof ActiveFilters, value: string) => void;
  setPriceRange: (min: string, max: string) => void;
  resetFilters: () => void;
}

const CatalogFilterContext = createContext<CatalogFilterContextType | undefined>(undefined);

export function CatalogFilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Optimistic local state for 0ms visual feedback
  const [filters, setFilters] = useState<ActiveFilters>({
    category: searchParams.get('category') || '',
    skinType: searchParams.get('skinType') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    q: searchParams.get('q') || '',
  });

  // Keep in sync when external navigation occurs (e.g. back/forward button)
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      skinType: searchParams.get('skinType') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      q: searchParams.get('q') || '',
    });
  }, [searchParams]);

  const pushURL = (newFilters: ActiveFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.skinType) params.set('skinType', newFilters.skinType);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.q) params.set('q', newFilters.q);

    const query = params.toString();
    const targetUrl = query ? `/products?${query}` : '/products';

    startTransition(() => {
      // scroll: false is essential to prevent page jitter/jumping to top
      router.replace(targetUrl, { scroll: false });
    });
  };

  const setFilter = (key: keyof ActiveFilters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    pushURL(updated);
  };

  const setPriceRange = (min: string, max: string) => {
    const updated = { ...filters, minPrice: min, maxPrice: max };
    setFilters(updated);
    pushURL(updated);
  };

  const resetFilters = () => {
    const reset: ActiveFilters = {
      category: '',
      skinType: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      q: '',
    };
    setFilters(reset);
    startTransition(() => {
      router.replace('/products', { scroll: false });
    });
  };

  return (
    <CatalogFilterContext.Provider
      value={{
        isPending,
        filters,
        setFilter,
        setPriceRange,
        resetFilters,
      }}
    >
      {children}
    </CatalogFilterContext.Provider>
  );
}

export function useCatalogFilter() {
  const context = useContext(CatalogFilterContext);
  if (!context) {
    throw new Error('useCatalogFilter must be used within a CatalogFilterProvider');
  }
  return context;
}
