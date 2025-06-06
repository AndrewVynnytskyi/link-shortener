import { JSX } from "react";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import { FieldApi } from "@tanstack/form-core";

export type Link = {
  url: string;
  shortUrl: string;
  clicks: number;
};

export type Links = {
  total: number;
  urls: Link[];
};

export type FormProps = {
  formComponents: JSX.Element[];
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
  submitButtonText: string;
  className: { formClassName: string; submitButtonClassName: string };
};

export type TextFieldProps = {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  placeholder: string;
  type: string;
  className: {
    sectionClassName: string;
    inputClassName: string;
    errorClassName: string;
  };
};

export type LoginFormFieldNames = "username" | "password";
export type SignUpFormFieldNames =
  | "username"
  | "email"
  | "password"
  | "confirmPassword";

export type UrlShortSectionProps = {
  urlFormComponents: JSX.Element[];
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
  sectionText: string
};

export type UrlShortFormFieldProps =
  'url' | 'backHalf'
