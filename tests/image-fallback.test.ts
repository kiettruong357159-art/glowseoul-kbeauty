import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductImageUrl,
  getProductImageArray,
  isValidImageUrl,
} from '../src/lib/image-fallback';
import { prisma } from '../src/lib/db';
import { createSessionToken, SESSION_COOKIE_NAME } from '../src/lib/auth';

describe('Global Image Fallback System & Wishlist Image Integrity', () => {
  describe('image-fallback helper unit tests', () => {
    it('validates URLs correctly with isValidImageUrl', () => {
      expect(isValidImageUrl('https://example.com/img.jpg')).toBe(true);
      expect(isValidImageUrl('http://example.com/img.png')).toBe(true);
      expect(isValidImageUrl('/placeholder-product.svg')).toBe(true);
      expect(isValidImageUrl('data:image/svg+xml;base64,...')).toBe(true);

      expect(isValidImageUrl('')).toBe(false);
      expect(isValidImageUrl('   ')).toBe(false);
      expect(isValidImageUrl(null)).toBe(false);
      expect(isValidImageUrl(undefined)).toBe(false);
      expect(isValidImageUrl('null')).toBe(false);
      expect(isValidImageUrl('undefined')).toBe(false);
      expect(isValidImageUrl('[]')).toBe(false);
    });

    it('extracts images from JSON array string correctly', () => {
      const jsonArr = '["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]';
      expect(getProductImageArray(jsonArr)).toEqual([
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
      ]);
      expect(getProductImageUrl(jsonArr)).toBe('https://example.com/photo1.jpg');
    });

    it('handles malformed single-quoted JSON strings gracefully', () => {
      const singleQuoted = "['https://example.com/photo1.jpg']";
      expect(getProductImageArray(singleQuoted)).toEqual(['https://example.com/photo1.jpg']);
      expect(getProductImageUrl(singleQuoted)).toBe('https://example.com/photo1.jpg');
    });

    it('handles direct string array correctly', () => {
      const arr = ['https://example.com/serum.jpg'];
      expect(getProductImageArray(arr)).toEqual(['https://example.com/serum.jpg']);
      expect(getProductImageUrl(arr)).toBe('https://example.com/serum.jpg');
    });

    it('handles single URL string directly', () => {
      const url = 'https://example.com/single.jpg';
      expect(getProductImageArray(url)).toEqual(['https://example.com/single.jpg']);
      expect(getProductImageUrl(url)).toBe('https://example.com/single.jpg');
    });

    it('falls back to DEFAULT_PRODUCT_IMAGE when images are null, undefined, or empty', () => {
      expect(getProductImageUrl(null)).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getProductImageUrl(undefined)).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getProductImageUrl('')).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getProductImageUrl('[]')).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getProductImageUrl([])).toBe(DEFAULT_PRODUCT_IMAGE);

      expect(getProductImageArray(null)).toEqual([DEFAULT_PRODUCT_IMAGE]);
      expect(getProductImageArray([])).toEqual([DEFAULT_PRODUCT_IMAGE]);
    });

    it('supports custom fallback image', () => {
      const customFallback = '/custom-fallback.png';
      expect(getProductImageUrl(null, customFallback)).toBe(customFallback);
      expect(getProductImageArray([], customFallback)).toEqual([customFallback]);
    });
  });

  describe('Wishlist API returns valid image property for all products', () => {
    it('GET /api/account/wishlist populates product.image with valid string URL', async () => {
      const { GET } = await import('@/app/api/account/wishlist/route');

      const user = await prisma.user.findFirst();
      const product = await prisma.product.findFirst({ skip: 5 });
      expect(user).toBeDefined();
      expect(product).toBeDefined();
      if (!user || !product) return;

      const token = createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.roleName,
      });
      const cookieHeader = `${SESSION_COOKIE_NAME}=${token}`;

      // Add to wishlist safely via upsert
      await prisma.wishlist.upsert({
        where: {
          userId_productId: {
            userId: user.id,
            productId: product.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          productId: product.id,
        },
      });

      try {
        const req = new NextRequest('http://localhost:3000/api/account/wishlist', {
          headers: { cookie: cookieHeader },
        });
        const res = await GET(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(Array.isArray(data.products)).toBe(true);
        expect(data.products.length).toBeGreaterThan(0);

        const wishlistItem = data.products.find((p: any) => p.id === product.id);
        expect(wishlistItem).toBeDefined();
        // Crucial test: product.image MUST exist and be a non-empty string URL
        expect(typeof wishlistItem.image).toBe('string');
        expect(wishlistItem.image.length).toBeGreaterThan(0);
        expect(isValidImageUrl(wishlistItem.image)).toBe(true);
      } finally {
        // Clean up
        await prisma.wishlist.deleteMany({
          where: { userId: user.id, productId: product.id },
        });
      }
    });
  });
});
