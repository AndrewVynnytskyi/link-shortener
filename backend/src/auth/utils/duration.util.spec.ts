import { parseDurationToMs } from './duration.util';

describe('parseDurationToMs', () => {
  it.each([
    ['30s', 30_000],
    ['15m', 900_000],
    ['2h', 7_200_000],
    ['2d', 172_800_000],
  ])('parses "%s" to %d ms', (input, expected) => {
    expect(parseDurationToMs(input)).toBe(expected);
  });

  it.each(['2', '2x', 'two days', ''])(
    'throws on invalid duration "%s"',
    (input) => {
      expect(() => parseDurationToMs(input)).toThrow();
    },
  );
});
