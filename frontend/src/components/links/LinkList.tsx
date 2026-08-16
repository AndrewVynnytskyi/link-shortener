"use client";

import { LinkCard } from "./LinkCard";
import { PaginationControls } from "./PaginationControls";
import { Skeleton } from "@/components/ui/Skeleton";
import { urlService } from "@/services/url.service";
import { ShortLink } from "@/types/url";

interface LinkListProps {
  links: ShortLink[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onDelete: (shortCode: string) => void;
  deletingCode?: string;
  isLoading: boolean;
  anonId?: string;
  isOwner: boolean;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export function LinkList({
  links,
  total,
  page,
  onPageChange,
  onDelete,
  deletingCode,
  isLoading,
  anonId,
  isOwner,
  pageSize = DEFAULT_PAGE_SIZE,
}: LinkListProps) {
  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        No links yet — shorten your first URL above.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {links.map((link) => (
        <LinkCard
          key={link.shortUrl}
          originalUrl={link.url}
          shortCode={link.shortUrl}
          shortLinkUrl={urlService.getShortLinkUrl(link.shortUrl)}
          clicks={link.clicks}
          anonId={anonId}
          isOwner={isOwner}
          onDelete={() => onDelete(link.shortUrl)}
          isDeleting={deletingCode === link.shortUrl}
        />
      ))}
      <PaginationControls
        pageCount={Math.ceil(total / pageSize)}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
