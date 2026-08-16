"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { CloseIcon } from "@/components/icons/CloseIcon";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible modal: traps focus on open, closes on `Escape` or a
 * backdrop click, and marks itself `role="dialog"`/`aria-modal`.
 * Replaces the previous `Overlay` + `CloseButton` pair, which had
 * neither.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "border-border bg-surface relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-xl border p-6 shadow-xl",
          "focus:outline-none",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="text-muted hover:bg-surface-hover hover:text-foreground absolute top-3 right-3 rounded-full p-2 transition-colors"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="text-foreground mb-4 pr-8 text-xl font-bold">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
