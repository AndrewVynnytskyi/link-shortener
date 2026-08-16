export interface DailyClickCount {
  date: string;
  count: number;
}

export interface ReferrerCount {
  referrer: string;
  count: number;
}

/** Analytics summary for a single link, as returned by the API. */
export interface LinkAnalytics {
  totalClicks: number;
  last30Days: DailyClickCount[];
  topReferrers: ReferrerCount[];
}
