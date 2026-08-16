/** A single shortened link, as returned by the API. */
export interface ShortLink {
  url: string;
  shortUrl: string;
  clicks: number;
}

/** Paginated list response for a user's/anon client's links. */
export interface PaginatedLinks {
  total: number;
  urls: ShortLink[];
}

/** Payload for creating a new short link. */
export interface CreateLinkInput {
  originalUrl: string;
  shortUrl?: string;
  userId?: string;
}
