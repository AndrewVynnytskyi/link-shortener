import Form from "@/app/components/Form";
import { useForm } from "@tanstack/react-form";
import InputField from "@/app/components/InputField";
import { z } from "zod";
import axios from "axios";

type UrlShortSectionProps = {
  userId: string | undefined;
  page: number;
  setLinks: any;
  setTotal: any;
};

type UrlFormFieldsName = "link";

export default function UrlShortSection({
  userId,
  page,
  setLinks,
  setTotal,
}: UrlShortSectionProps) {
  const form = useForm({
    defaultValues: {
      link: "",
    },
    validators: {
      onChange: z.object({
        link: z.string().url("You have to paste valid url"),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await axios({
          method: "POST",
          url: process.env.NEXT_PUBLIC_API_KEY,
          data: {
            originalUrl: value.link,
            userId: userId,
          },
        });

        console.log(res.data);
        if (page === 0) {
          setLinks((prev: any) => [
            {
              url: res.data.url,
              shortUrl: res.data.shortUrl,
              clicks: res.data.clicks,
            },
            ...prev,
          ]);
        }
        setTotal((prev: number) => prev + 1);
      } catch (e) {
        console.error(e);
      }
    },
  });

  const urlFormData: {
    name: UrlFormFieldsName;
    placeholder: string;
    type: string;
  }[] = [
    {
      name: "link",
      placeholder: "Enter the link here",
      type: "url",
    },
  ];

  const urlFormComponents = urlFormData.map(
    ({ name, placeholder, type }, i) => (
      <form.Field key={i} name={name}>
        {(field) => (
          <InputField
            className={{
              sectionClassName: "mb-6 w-4/5 pt-3",
              inputClassName: "mt-6 mr-0 ml-0 w-full rounded-l-md",
              errorClassName: "mb-9",
            }}
            field={field}
            placeholder={placeholder}
            type={type}
          />
        )}
      </form.Field>
    ),
  );

  return (
    <section
      className={"w-[750px] rounded-md bg-white p-2 shadow-xl shadow-gray-200"}
    >
      <h2 className={"m-2 mb-0 text-center text-3xl font-bold text-gray-500"}>
        Paste the URL to be shortened
      </h2>
      <Form
        className={{
          formClassName: "flex flex-row items-center justify-center",
          submitButtonClassName: "rounded-r-md",
        }}
        formComponents={urlFormComponents}
        form={form}
        submitButtonText={"Shorten Url"}
      />
    </section>
  );
}
