import SubmitButton from "@/app/components/SubmitButton";
import { JSX } from "react";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import { FormProps } from "@/app/types/types";



export default function Form({
  formComponents,
  form,
  submitButtonText,
  className,
}: FormProps) {
  return (
    <form
      className={className?.formClassName}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch(console.error);
      }}
    >
      {formComponents}
      <SubmitButton
        className={className?.submitButtonClassName}
        text={submitButtonText}
      />
    </form>
  );
}
