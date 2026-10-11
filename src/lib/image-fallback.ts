/**
 * Global Product Image Fallback Utilities for GlowSeoul K-Beauty
 * Ensures rock-solid image loading and fallbacks across the entire system.
 */

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

export const LOCAL_PLACEHOLDER_IMAGE = '/placeholder-product.svg';

/**
 * Validates if a string is a non-empty string URL or path
 */
export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '[]') return false;
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')
  );
}

/**
 * Parses raw product images (JSON string, array, or single URL) and returns an array of valid URLs.
 * If no valid images are found, returns an array containing the fallback image.
 */
export function getProductImageArray(
  input: unknown,
  fallback: string = DEFAULT_PRODUCT_IMAGE
): string[] {
  if (!input) return [fallback];

  if (Array.isArray(input)) {
    const valid = input.filter(isValidImageUrl);
    return valid.length > 0 ? valid : [fallback];
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [fallback];

    // Try parsing as JSON array
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isValidImageUrl);
          if (valid.length > 0) return valid;
        }
      } catch {
        // Handle malformed JSON like single quotes "['http...']"
        try {
          const sanitized = trimmed.replace(/'/g, '"');
          const parsed = JSON.parse(sanitized);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(isValidImageUrl);
            if (valid.length > 0) return valid;
          }
        } catch {
          // continue to single URL check
        }
      }
    }

    if (isValidImageUrl(trimmed)) {
      return [trimmed];
    }
  }

  return [fallback];
}

/**
 * Extracts the primary product image URL from any input format (JSON string, array, or single URL).
 * Always returns a valid string URL, falling back to DEFAULT_PRODUCT_IMAGE.
 */
export function getProductImageUrl(
  input: unknown,
  fallback: string = DEFAULT_PRODUCT_IMAGE
): string {
  const images = getProductImageArray(input, fallback);
  return images[0] || fallback;
}
