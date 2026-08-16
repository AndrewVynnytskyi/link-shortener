"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CopyIcon } from "@/components/icons/CopyIcon";
import { QrCodeIcon } from "@/components/icons/QrCodeIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { ChartIcon } from "@/components/icons/ChartIcon";
import { QrCodeDialog } from "./QrCodeDialog";
import { AnalyticsDrawer } from "./AnalyticsDrawer";
import { useClipboard } from "@/hooks/use-clipboard";
import { formatCount } from "@/utils/format";

interface LinkCardProps {
  originalUrl: string;
  shortCode: string;
  shortLinkUrl: string;
  clicks: number;
  anonId?: string;
  isOwner: boolean;
  onDelete: () => void;
  isDeleting?: boolean;
}

const iconButtonClasses =
  "flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground";

export function LinkCard({
  originalUrl,
  shortCode,
  shortLinkUrl,
  clicks,
  anonId,
  isOwner,
  onDelete,
  isDeleting = false,
}: LinkCardProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const copyToClipboard = useClipboard();

  return (
    <>
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-muted text-xs">Destination</p>
          <p className="text-foreground truncate text-sm" title={originalUrl}>
            {originalUrl}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <a
              href={shortLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary truncate text-sm font-medium hover:underline"
            >
              {shortLinkUrl}
            </a>
            <Badge>{formatCount(clicks)} clicks</Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconButtonClasses}
            aria-label="Copy short link"
            onClick={() => copyToClipboard(shortLinkUrl)}
          >
            <CopyIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={iconButtonClasses}
            aria-label="View analytics"
            onClick={() => setIsAnalyticsOpen(true)}
          >
            <ChartIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={iconButtonClasses}
            aria-label="Show QR code"
            onClick={() => setIsQrOpen(true)}
          >
            <QrCodeIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`${iconButtonClasses} hover:bg-danger/10 hover:text-danger`}
            aria-label="Delete link"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </Card>

      <QrCodeDialog
        open={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        shortLinkUrl={shortLinkUrl}
      />
      <AnalyticsDrawer
        open={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        code={shortCode}
        anonId={anonId}
        isOwner={isOwner}
      />
    </>
  );
}
