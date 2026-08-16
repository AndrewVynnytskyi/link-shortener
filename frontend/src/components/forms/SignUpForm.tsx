"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/auth-context";
import { getApiErrorMessage } from "@/services/http-client";

const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("You have to write a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/\d/, "Add a number")
      .regex(/[^A-Za-z0-9]/, "Add a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** Signup form, promoted from a modal to a full page at `/signup`. */
export function SignUpForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onChange: signUpSchema },
    onSubmit: async ({ value }) => {
      try {
        await signup(value);
        toast.success("You're signed up! Please log in.");
        router.push("/login");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not create your account"));
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
      <form.Field name="username">
        {(field) => (
          <FormField field={field} label="Username" placeholder="jane_doe" />
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <FormField
            field={field}
            label="Email"
            type="email"
            placeholder="jane@example.com"
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
      <form.Field name="confirmPassword">
        {(field) => (
          <FormField
            field={field}
            label="Confirm password"
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
            Sign up
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
