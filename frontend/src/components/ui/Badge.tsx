import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** A small pill used for counts and status labels (e.g. click counts). */
export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}
