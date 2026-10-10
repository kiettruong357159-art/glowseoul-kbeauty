import { cache } from 'react';
import { prisma } from '@/lib/db';

/**
 * Deduplicated product fetcher for React Server Components.
 * Within a single request, multiple calls with the same id (e.g. generateMetadata and Page)
 * share the exact same database promise and result.
 */
export const getProductById = cache(async (id: string) => {
  if (!id) return null;
  return prisma.product.findUnique({
    where: { id },
  });
});
