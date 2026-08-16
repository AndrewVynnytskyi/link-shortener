"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/services/http-client";

const shortenUrlSchema = z.object({
  originalUrl: z.string().url("You have to paste a valid URL"),
  customSlug: z
    .string()
    .regex(/^[a-zA-Z0-9-]{3,30}$/, "3-30 letters, numbers or hyphens")
    .optional()
    .or(z.literal("")),
});

export type ShortenUrlFormValues = z.infer<typeof shortenUrlSchema>;

interface ShortenUrlFormProps {
  onSubmit: (values: ShortenUrlFormValues) => Promise<unknown>;
  showCustomSlug?: boolean;
  submitLabel?: string;
}

/**
 * The URL-shortening form, shared by the homepage (anonymous) and
 * "My Links" (authenticated) flows — only the submit handler and
 * whether the custom back-half field is shown differ between them.
 */
export function ShortenUrlForm({
  onSubmit,
  showCustomSlug = false,
  submitLabel = "Shorten URL",
}: ShortenUrlFormProps) {
  const form = useForm({
    defaultValues: { originalUrl: "", customSlug: "" } as ShortenUrlFormValues,
    validators: { onChange: shortenUrlSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit(value);
        formApi.reset();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not create the link"));
      }
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit().catch(() => undefined);
      }}
    >
      <div className="flex-1">
        <form.Field name="originalUrl">
          {(field) => (
            <FormField
              field={field}
              label="URL to shorten"
              hideLabel
              placeholder="Paste a long URL"
              type="url"
            />
          )}
        </form.Field>
      </div>
      {showCustomSlug && (
        <div className="sm:w-56">
          <form.Field name="customSlug">
            {(field) => (
              <FormField
                field={field}
                label="Custom back-half (optional)"
                hideLabel
                placeholder="Custom back-half (optional)"
              />
            )}
          </form.Field>
        </div>
      )}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
