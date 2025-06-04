import SubmitButton from "@/app/components/SubmitButton";
import { JSX } from "react";
import { ReactFormExtendedApi } from "@tanstack/react-form";

type FormProps = {
  formComponents: JSX.Element[];
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
  submitButtonText: string;
  className: string
};

export default function Form({
  formComponents,
  form,
  submitButtonText,
  className
}: FormProps) {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch(console.error);
      }}
    >
      {formComponents}
      <SubmitButton text={submitButtonText} />
    </form>
  );
}
