/**
 * Returns the API base URL, failing loudly at call time instead of
 * silently producing `"undefined/anon"`-style request URLs (the
 * previous behavior whenever `NEXT_PUBLIC_API_URL` was unset).
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Copy frontend/.env.example to frontend/.env.local and set it.",
    );
  }
  return apiUrl;
}
