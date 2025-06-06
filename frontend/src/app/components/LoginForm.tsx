import { useForm } from "@tanstack/react-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "typescript-cookie";
import Overlay from "@/app/components/Overlay";
import { RefObject } from "react";
import Form from "@/app/components/Form";
import InputField from "@/app/components/InputField";
import { toast } from "react-hot-toast";
import { LoginFormFieldNames } from "@/app/types/types";



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
    description: string;
  }[] = [
    {
      name: "username",
      placeholder: "Enter your username or email",
      type: "text",
      description: "Username or email",
    },
    {
      name: "password",
      placeholder: "Enter your password",
      type: "password",
      description: "Password",
    },
  ];

  const LoginFormComponents = formData.map(
    ({ name, placeholder, type, description }, i) => (
      <form.Field key={i} name={name}>
        {(field) => (
          <>
            <p className={"m-2 mb-0 text-center text-lg text-gray-500"}>
              {description}
            </p>
            <InputField
              className={{
                sectionClassName: "w-full",
                inputClassName: "mr-0 ml-0 w-full rounded-md",
                errorClassName: "mb-3",
              }}
              field={field}
              placeholder={placeholder}
              type={type}
            />
          </>
        )}
      </form.Field>
    ),
  );

  return (
    <Overlay className={"w-3/5"} ref={ref}>
      <h2
        className={
          "m-6 text-2xl font-bold text-blue-500 text-shadow-gray-300 text-shadow-sm"
        }
      >
        Login
      </h2>
      <Form
        className={{
          formClassName: "flex w-4/5 flex-col items-start justify-center",
          submitButtonClassName:
            "relative right-[-10%] mb-2 self-end rounded-md",
        }}
        formComponents={LoginFormComponents}
        form={form}
        submitButtonText={"Login"}
      />
    </Overlay>
  );
}
