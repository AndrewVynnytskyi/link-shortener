import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** A themed surface container used for panels, list rows, and sections. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border bg-surface rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
