'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import axios from 'axios';
import { getCookie, setCookie } from 'typescript-cookie';
import { nanoid } from 'nanoid';
import { toast, Toaster } from 'react-hot-toast';
import LinkCard from '@/app/components/LinkCard';
import PagComp from '@/app/components/PagComp';
import Form from '@/app/components/Form';
import InputField from '@/app/components/InputField';
import {z} from 'zod'
import SignUpForm from "@/app/components/SignUpForm";


type Link = {
  url: string,
  shortUrl: string,
  clicks: number
}

type Links = {
  total: number,
  urls: Link[]
}

type UrlFormFieldsName = 'link'


export default function Home({ data }: { data: Links }) {
  const [links, setLinks] = useState<Link[]>(data.urls);
  const [total, setTotal] = useState<number>(data.total);
  const [page, setPage] = useState<number>(0);
  const pathname = usePathname();
  const signUpRef = useRef<HTMLElement>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const form = useForm({
    defaultValues: {
      link: '',
    },
    validators:{
     onChange: z.object({
       link: z.string().url('You have to paste valid url')
     })
    },
    onSubmit: async ({ value }) => {
      try {

        const res = await axios({
            method: 'POST',
            url: process.env.NEXT_PUBLIC_API_KEY,
            data: {
              originalUrl: value.link,
              userId: userId,
            },
          },
        );

        console.log(res.data);
        if (page === 0) {
          setLinks(prev => [
            { url: res.data.url, shortUrl: res.data.shortUrl, clicks: res.data.clicks }, ...prev]);
        }
        setTotal(prev => prev + 1);

      } catch (e) {
        console.error(e);
      }

    },
  });

  const handleSignUpForm = () => {
    if (signUpRef.current) {
      signUpRef.current.classList.remove("hidden");
    }
  }

  useEffect(() => {
    if (getCookie('userId')) {
      setUserId(getCookie('userId'));
      return;
    }
    const userId = nanoid(4);
    setCookie('userId', userId);
    setUserId(userId);

  }, []);


  async function handleDelete(shortenLink: string) {
    console.log(shortenLink);
    setTotal(prev => prev - 1);
    await axios({
      method: 'delete',
      url: process.env.NEXT_PUBLIC_API_KEY + `${shortenLink}`,
    }).then(() => toast.success('Successfully deleted')).catch((e) => toast.error('Error' + e));
    setPage(page);
    const res = await axios({
      method: 'get',
      url: process.env.NEXT_PUBLIC_API_KEY + `/user/${userId}/${page}`,
    });
    setLinks(res.data.urls);
  }

  async function onPageChange(event: { selected: any; }) {
    setPage(event.selected);
    const res = await axios({
      method: 'get',
      url: process.env.NEXT_PUBLIC_API_KEY + `/user/${userId}/${event.selected}`,
    });
    setLinks(res.data.urls);

  }

  const urlFormData: { name: UrlFormFieldsName, placeholder: string, type: string }[] = [{
    name: 'link',
    placeholder: 'Enter the link here',
    type: 'url',
  }];

  const urlFormComponents = urlFormData.map(({ name, placeholder, type }, i) => (
    <form.Field key={i} name={name}>
      {
        (field) => (<InputField field={field} placeholder={placeholder} type={type}/>)
      }
    </form.Field>
  ));


  const linkComponents = links.map((link, i) => {
    return <LinkCard key={i} originalLink={link.url} shortenLink={pathname + link.shortUrl}
                     handleDelete={() => handleDelete(pathname + link.shortUrl)} />;
  });

  return (
    <main className={'flex flex-col justify-center items-center gap-2'}>
      <Toaster />
      <div className={'absolute top-2 right-2 flex justify-center items-center gap-2'}>
        <button  className={"p-2 text-white font-bold h-10 rounded-md bg-blue-500 text-center shadow-md shadow-blue-500 transition-shadow hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600"}>Login</button>
        <button onClick={handleSignUpForm} className={"p-2 text-blue-500 font-bold h-10 rounded-md bg-white text-center shadow-md shadow-white transition-shadow hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-200"}>Sign Up</button>
      </div>
      <h1 className={'font-bold text-blue-500 text-5xl text-shadow-sm text-shadow-gray-300 m-6'}>Link
        Shortener </h1>
      <section className={'w-[750px] bg-white rounded-md shadow-xl shadow-gray-200 p-2'}>
        <h2 className={'font-bold text-gray-500 text-3xl m-2 text-center'}>Paste the URL to be shortened</h2>
        <Form formComponents={urlFormComponents} form={form} submitButtonText={'Shorten Url'} />
      </section>
      <section className={'flex flex-col gap-2'}>
        <PagComp currentItems={linkComponents} pageCount={Math.ceil(total / 10)} onPageChange={onPageChange} />
      </section>
      <SignUpForm ref={signUpRef}/>
    </main>
  );
}
