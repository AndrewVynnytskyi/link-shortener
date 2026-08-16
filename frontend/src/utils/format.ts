/**
 * Formats an ISO date string (`"2026-08-15"`) as a short, locale-aware
 * label for chart axes, e.g. "Aug 15".
 */
export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/** Formats a click/view count with thousands separators. */
export function formatCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}
