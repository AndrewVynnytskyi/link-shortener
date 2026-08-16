"use client";

import ReactPaginate from "react-paginate";

interface PaginationControlsProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/** Thin wrapper around `react-paginate`, themed with design tokens. */
export function PaginationControls({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationControlsProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      forcePage={currentPage}
      pageCount={pageCount}
      nextLabel="›"
      previousLabel="‹"
      pageRangeDisplayed={5}
      renderOnZeroPageCount={null}
      onPageChange={(event) => onPageChange(event.selected)}
      className="flex items-center justify-center gap-1 py-2"
      pageLinkClassName="flex h-9 w-9 items-center justify-center rounded-full text-sm text-foreground hover:bg-surface-hover cursor-pointer"
      activeLinkClassName="!bg-primary !text-primary-foreground"
      previousLinkClassName="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-surface-hover cursor-pointer"
      nextLinkClassName="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-surface-hover cursor-pointer"
      breakLinkClassName="flex h-9 w-9 items-center justify-center text-muted"
      disabledLinkClassName="opacity-40 cursor-not-allowed"
    />
  );
}
