import { generateSlug, isValidCustomSlug } from './slug.util';

describe('slug.util', () => {
  describe('generateSlug', () => {
    it('generates an 8-character URL-safe slug', () => {
      const slug = generateSlug();
      expect(slug).toHaveLength(8);
      expect(isValidCustomSlug(slug)).toBe(true);
    });

    it('generates distinct slugs across calls', () => {
      const slugs = new Set(Array.from({ length: 20 }, () => generateSlug()));
      expect(slugs.size).toBe(20);
    });
  });

  describe('isValidCustomSlug', () => {
    it.each(['abc', 'my-launch', 'A1-b2-C3', 'a'.repeat(30)])(
      'accepts valid slug "%s"',
      (slug) => {
        expect(isValidCustomSlug(slug)).toBe(true);
      },
    );

    it.each([
      'ab',
      'a'.repeat(31),
      'has space',
      'has_underscore',
      'emoji😀',
      '',
    ])('rejects invalid slug "%s"', (slug) => {
      expect(isValidCustomSlug(slug)).toBe(false);
    });
  });
});
