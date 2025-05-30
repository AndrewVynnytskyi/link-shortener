import { FieldApi } from '@tanstack/form-core';

type TextFieldProps = {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>,
  placeholder: string
  type:string
}


export default function InputField({ field, placeholder, type }: TextFieldProps) {

  const error = field.state.meta.errors?.[0]?.message;

  return (
    <>
      <input
        type={type}
        className={'w-4/5 pl-4 border border-gray-300 rounded-l-md m-6 mr-0 ml-0 h-14 placeholder:p-4'}
        name={field.name}
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
      />
      {error  && <p className={'text-red-500 text-[8px] relative left-0'} >! {error}</p>}
    </>
  );

}