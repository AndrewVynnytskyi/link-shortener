"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/auth-context";
import { getApiErrorMessage } from "@/services/http-client";

/** Login form, promoted from a modal to a full page at `/login`. */
export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm({
    defaultValues: { login: "", password: "" },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        toast.success("Welcome back!");
        router.push("/my-links");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Invalid login or password"));
      }
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit().catch(() => undefined);
      }}
    >
      <form.Field name="login">
        {(field) => (
          <FormField
            field={field}
            label="Username or email"
            placeholder="jane_doe"
          />
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormField
            field={field}
            label="Password"
            type="password"
            placeholder="••••••••"
          />
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            className="mt-2"
          >
            Log in
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
