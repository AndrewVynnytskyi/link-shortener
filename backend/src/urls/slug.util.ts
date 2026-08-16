import { randomBytes } from 'node:crypto';

const DEFAULT_SLUG_LENGTH = 8;
const BASE62_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const CUSTOM_SLUG_PATTERN = /^[a-zA-Z0-9-]{3,30}$/;

/**
 * Generates a random, URL-safe short code for links that don't request
 * a custom back-half. Uses `node:crypto` directly (rather than a
 * third-party id generator) to keep the dependency footprint small and
 * avoid ESM/CJS interop issues in the test runner.
 */
export function generateSlug(length = DEFAULT_SLUG_LENGTH): string {
  const bytes = randomBytes(length);
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += BASE62_ALPHABET[bytes[i] % BASE62_ALPHABET.length];
  }
  return slug;
}

/**
 * Whether a user-supplied custom back-half is well-formed: 3-30
 * characters, alphanumeric plus hyphens only (keeps generated URLs
 * safe to embed in paths/QR codes without escaping).
 */
export function isValidCustomSlug(slug: string): boolean {
  return CUSTOM_SLUG_PATTERN.test(slug);
}
