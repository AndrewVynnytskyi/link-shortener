import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "typescript-cookie";
import Overlay from "@/app/components/Overlay";
import { RefObject } from "react";
import Form from "@/app/components/Form";
import InputField from "@/app/components/InputField";
import { toast } from "react-hot-toast";

type LoginFormFieldNames = "username" | "password";

export default function LoginForm({ ref }: { ref: RefObject<any> }) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await axios({
          method: "post",
          url: process.env.NEXT_PUBLIC_API_KEY + "/auth/login",
          data: {
            login: value.username,
            password: value.password,
          },
        });
        setCookie("jwt-token", res.data);
        router.push("/my-links");
      } catch (e: AxiosError | any) {
        toast.error("Error: " + e.response.data.message);
      }
    },
  });

  const formData: {
    name: LoginFormFieldNames;
    placeholder: string;
    type: string;
  }[] = [
    { name: "username", placeholder: "Enter your username", type: "text" },
    { name: "password", placeholder: "Enter your password", type: "password" },
  ];

  const LoginFormComponents = formData.map(({ name, placeholder, type }, i) => (
    <form.Field key={i} name={name}>
      {(field) => (
        <InputField field={field} placeholder={placeholder} type={type} />
      )}
    </form.Field>
  ));

  return (
    <Overlay ref={ref}>
      <h2>Login</h2>
      <Form
        formComponents={LoginFormComponents}
        form={form}
        submitButtonText={"Login"}
      />
    </Overlay>
  );
}
