const UNIT_TO_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/**
 * Parses a simple duration string such as `"2d"`, `"15m"`, `"3600s"`
 * into milliseconds. Mirrors the subset of `jsonwebtoken`'s
 * `expiresIn` syntax we actually use, so `JWT_EXPIRES_IN` can drive
 * both the token's `exp` claim and the cookie's `maxAge`.
 *
 * @throws Error if the string doesn't match `<number><s|m|h|d>`.
 */
export function parseDurationToMs(duration: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration.trim());
  if (!match) {
    throw new Error(
      `Invalid duration format: "${duration}" (expected e.g. "2d", "15m", "3600s")`,
    );
  }
  const [, amount, unit] = match;
  return parseInt(amount, 10) * UNIT_TO_MS[unit];
}
