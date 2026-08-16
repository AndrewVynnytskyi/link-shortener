"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Dialog } from "@/components/ui/Dialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLinkAnalyticsQuery } from "@/hooks/use-analytics";
import { formatCount, formatShortDate } from "@/utils/format";

interface AnalyticsDrawerProps {
  open: boolean;
  onClose: () => void;
  code: string;
  anonId?: string;
  isOwner: boolean;
}

/** Per-link analytics: total clicks, a 30-day trend chart, and top referrers. */
export function AnalyticsDrawer({
  open,
  onClose,
  code,
  anonId,
  isOwner,
}: AnalyticsDrawerProps) {
  const { data, isLoading, isError } = useLinkAnalyticsQuery({
    code,
    anonId,
    isOwner,
    enabled: open,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Link analytics"
      className="max-w-lg"
    >
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-danger text-sm">
          Could not load analytics for this link.
        </p>
      )}

      {data && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-muted text-sm">Total clicks</p>
            <p className="text-foreground text-3xl font-bold">
              {formatCount(data.totalClicks)}
            </p>
          </div>

          <div>
            <p className="text-muted mb-2 text-sm font-medium">Last 30 days</p>
            {data.last30Days.length === 0 ? (
              <p className="text-muted text-sm">No clicks recorded yet.</p>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.last30Days}
                    margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      tick={{ fontSize: 11 }}
                      stroke="currentColor"
                      className="text-muted"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      stroke="currentColor"
                      className="text-muted"
                    />
                    <Tooltip
                      labelFormatter={(value) => formatShortDate(String(value))}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div>
            <p className="text-muted mb-2 text-sm font-medium">Top referrers</p>
            {data.topReferrers.length === 0 ? (
              <p className="text-muted text-sm">No referrer data yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.topReferrers.map((referrer) => (
                  <li
                    key={referrer.referrer}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground truncate">
                      {referrer.referrer}
                    </span>
                    <span className="text-muted font-semibold">
                      {formatCount(referrer.count)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
