import { Input, InputProps } from "@/components/ui/Input";

/**
 * The subset of `@tanstack/react-form`'s `FieldApi` this component
 * relies on. Kept as a narrow structural type (rather than importing
 * `FieldApi`'s full generic signature) so this file doesn't need to
 * know about the form's value shape.
 */
export interface FormFieldLike {
  name: string;
  state: {
    value: string | undefined;
    meta: {
      errors: Array<{ message: string } | string | undefined>;
      isDefaultValue: boolean;
    };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

interface FormFieldProps
  extends Omit<InputProps, "value" | "onChange" | "onBlur" | "name" | "error"> {
  field: FormFieldLike;
}

/** Bridges a tanstack/react-form field to the `ui/Input` primitive. */
export function FormField({
  field,
  label,
  ...inputProps
}: FormFieldProps & { label: string }) {
  const rawError = field.state.meta.isDefaultValue
    ? undefined
    : field.state.meta.errors[0];
  const error = typeof rawError === "string" ? rawError : rawError?.message;

  return (
    <Input
      name={field.name}
      label={label}
      value={field.state.value ?? ""}
      onChange={(event) => field.handleChange(event.target.value)}
      onBlur={field.handleBlur}
      error={error}
      {...inputProps}
    />
  );
}
