"use client";

import { Link, Links, UrlShortFormFieldProps } from "@/app/types/types";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "typescript-cookie";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import Overlay from "@/app/components/Overlay";
import UrlShortSection from "@/app/components/UrlShortSection";
import UrlInformationSection from "@/app/components/UrlInformationSection";
import { nanoid } from "nanoid";


export default function MyLinks({ data }: { data: Links }) {
  const [links, setLinks] = useState<Link[]>(data.urls);
  const [jwtToken, setJwtToken] = useState<string>();
  const router = useRouter();
  const urlShortFormRef = useRef<HTMLElement>(null);

  const form = useForm({
    defaultValues: {
      url: "",
      backHalf: ""
    },
    validators: {
      onChange: z.object({
        url: z.string().url("You have to paste valid url"),
        backHalf: z.string()
      })
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_API_KEY + "/user",
            data: {
              originalUrl: value.url,
              shortUrl: value.backHalf
            },
            headers: { Authorization: `Bearer ${jwtToken?.valueOf()}` }
          }
        );

        setLinks(prev => [{
          url: res.data.url,
          shortUrl: res.data.shortUrl,
          clicks: res.data.clicks
        }, ...prev]);
      } catch (e) {
        console.error(e);
      }
    }
  });

  const url = useStore(form.store, (state) => state.values.url);
  const backHalf = useStore(form.store, (state) => state.values.backHalf);


  // useEffect(() => {
  //   return form.store.subscribe(() =>{
  //     if(form.state.values.url){
  //       form.setFieldValue('backHalf', () => nanoid(15));
  //     }
  //   })
  // }, [form]);
  //
  useEffect(() => {
    form.setFieldValue("backHalf", () => nanoid(15));
  }, [url]);


  useEffect(() => {
    if (!getCookie("jwt-token")) {
      router.push("/");
    }
    setJwtToken(getCookie("jwt-token"));
  }, []);

  const handleNewLink = () => {
    if (urlShortFormRef.current) {
      urlShortFormRef.current.classList.remove("hidden");
    }
  };

  const urlShortFormData: { name: UrlShortFormFieldProps, placeholder: string, description: string }[] = [{
    name: "url",
    placeholder: "Enter your url",
    description: "Destination URL"
  }, {
    name: "backHalf",
    placeholder: "Enter your custom short url",
    description: "Back-half"
  }
  ];

  const urlShortFormComponents = urlShortFormData.map(({ name, placeholder, description }, index) => (
    <form.Field name={name} key={index}>
      {
        (field) => (
          <>
            <p>{description}</p>
            <InputField field={field} placeholder={placeholder} type={"text"} className={{
              sectionClassName: "mb-6 w-4/5 pt-3",
              inputClassName: "mt-6 mr-0 ml-0 w-full rounded-l-md",
              errorClassName: "mb-9"
            }} />
          </>

        )
      }
    </form.Field>


  ));


  return (<main>
    <h1>My Links</h1>
    <button onClick={handleNewLink}>New Link</button>
    <Overlay ref={urlShortFormRef} className={""}>
      <UrlShortSection urlFormComponents={urlShortFormComponents} form={form}
                       sectionText={"Create a new branded link"} />
      <UrlInformationSection url={url}
                             shortUrl={process.env.NEXT_PUBLIC_API_KEY + "/" + backHalf} />
    </Overlay>
  </main>);
}
