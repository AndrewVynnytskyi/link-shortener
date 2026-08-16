import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

/**
 * Base text input with an always-present, properly associated
 * `<label>` and `aria-invalid`/`aria-describedby` wiring for the error
 * message. `hideLabel` visually hides the label (e.g. inline
 * "shorten a URL" bar) while keeping it in the accessibility tree.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hideLabel = false, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={hideLabel ? "sr-only" : "text-muted text-sm font-medium"}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "border-border bg-surface text-foreground placeholder:text-muted h-12 w-full rounded-lg border px-4",
            "focus:border-primary focus:ring-primary/30 transition focus:ring-2 focus:outline-none",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-danger text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
