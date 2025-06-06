import { FieldApi } from "@tanstack/form-core";
import { TextFieldProps } from "@/app/types/types";




export default function InputField({
  field,
  placeholder,
  type,
  className,
}: TextFieldProps) {
  const error =
    !field.state.meta.isDefaultValue && field.state.meta.errors?.[0]?.message;

  return (
    <section
      className={`${className?.sectionClassName} relative flex flex-col items-start justify-center ${!error && className?.errorClassName}`}
    >
      <input
        type={type}
        className={`${className?.inputClassName} h-14 border border-gray-300 pl-4 transition placeholder:p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        name={field.name}
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
        required
      />
      {error && <p className={`m-0 text-[8px] text-red-500`}>! {error}</p>}
    </section>
  );
}
