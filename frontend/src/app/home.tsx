'use client'

import { use, useEffect, useState } from 'react';
import {usePathname} from "next/navigation";
import {useForm} from "@tanstack/react-form";
import axios from "axios";
import {getCookie, setCookie} from "typescript-cookie";
import {nanoid} from "nanoid";
import {toast, Toaster} from "react-hot-toast";
import LinkCard from "@/app/components/LinkCard";
import PagComp from '@/app/components/PagComp';


type Link = {
    url: string,
    shortUrl: string,
    clicks: number
}

type Links = {
    total:number,
    urls: Link[]
}

export default function Home({data}: { data: Links }) {
    const [links, setLinks] = useState<Link[]>(data.urls)
    const [total, setTotal] = useState<number>(data.total)
    const [page, setPage] = useState<number>(0);
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | undefined>();
    const form = useForm({
        defaultValues: {
            link: '',
        },
        onSubmit: async ({value}) => {
            try {

                const res = await axios({
                        method: 'POST',
                        url: process.env.NEXT_PUBLIC_API_KEY,
                        data: {
                            originalUrl: value.link,
                            userId: userId
                        }
                    }
                )

                console.log(res.data);
                if(page === 0){
                    setLinks(prev => [
                        {url: res.data.url, shortUrl: res.data.shortUrl, clicks: res.data.clicks}, ...prev]);
                }
                setTotal(prev => prev + 1);

            } catch (e) {
                console.error(e)
            }

        },
    })

    useEffect(() => {
        if (getCookie("userId")) {
            setUserId(getCookie("userId"));
            return;
        }
        const userId = nanoid(4)
        setCookie("userId", userId);
        setUserId(userId);

    }, []);


    async function handleDelete(shortenLink: string) {
        console.log(shortenLink);
        await axios({
            method: "delete",
            url: process.env.NEXT_PUBLIC_API_KEY + `${shortenLink}`
        }).then(() => toast.success("Successfully deleted")).catch((e) => toast.error("Error" + e));
        setLinks(links.filter(value => pathname + value.shortUrl !==  shortenLink))

    }

    async function onPageChange(event: { selected: any; }){
        setPage(event.selected);
        const res = await axios({
            method:"get",
            url: process.env.NEXT_PUBLIC_API_KEY +  `/user/${userId}/${event.selected}`
        });
        setLinks(res.data.urls);

    }



    const linkComponents = links.map((link, i) => {
        return <LinkCard key={i} originalLink={link.url} shortenLink={pathname + link.shortUrl}
                         handleDelete={() => handleDelete(pathname + link.shortUrl)}/>
    })

    return (
        <main className={"flex flex-col justify-center items-center gap-2"}>
            <Toaster/>
            <h1 className={"font-bold text-blue-500 text-5xl text-shadow-sm text-shadow-gray-300 m-6"}>Link
                Shortener </h1>
            <section className={"w-[750px] bg-white rounded-md shadow-xl shadow-gray-200 p-2"}>
                <h2 className={"font-bold text-gray-500 text-3xl m-2 text-center"}>Paste the URL to be shortened</h2>
                <form className={"flex flex-row justify-center items-center"} onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    form.handleSubmit().catch(console.error);
                }}>
                    <form.Field name={'link'}>{
                        (field) => (
                            // Distinct component
                            // <TextInput {...field} />
                            // shadcn/ui
                            <>
                                <input
                                    className={"w-4/5 pl-4 border border-gray-300 rounded-l-md m-6 mr-0 ml-0 h-14 placeholder:p-4"}
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    placeholder={'Enter the link here'}
                                />
                            </>
                        )
                    }</form.Field>
                    <button
                        className={"p-2 text-white h-14 rounded-r-md bg-blue-500 text-center shadow-md shadow-blue-500 transition-shadow hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600"}
                        type={"submit"}>Shorten Url
                    </button>
                </form>
            </section>
            <section className={"flex flex-col gap-2"}>
                <PagComp currentItems={linkComponents} pageCount={Math.ceil(total/10)}  onPageChange={onPageChange}/>
            </section>
        </main>
    );
}
