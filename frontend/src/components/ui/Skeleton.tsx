import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** A pulsing placeholder block shown while data is loading. */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("bg-surface-hover animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
