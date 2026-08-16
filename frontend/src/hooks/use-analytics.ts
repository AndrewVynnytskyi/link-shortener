"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";

interface UseAnalyticsOptions {
  code: string;
  anonId?: string;
  isOwner: boolean;
  enabled: boolean;
}

/** Fetches the analytics summary for a link, once opened. */
export function useLinkAnalyticsQuery({
  code,
  anonId,
  isOwner,
  enabled,
}: UseAnalyticsOptions) {
  return useQuery({
    queryKey: ["analytics", code, isOwner ? "own" : anonId],
    queryFn: () =>
      isOwner
        ? analyticsService.getForOwner(code)
        : analyticsService.getForAnonymous(anonId as string, code),
    enabled: enabled && (isOwner || Boolean(anonId)),
  });
}
