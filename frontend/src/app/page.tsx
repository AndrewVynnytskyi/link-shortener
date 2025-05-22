'use client'

import {useForm} from "@tanstack/react-form";
import axios from "axios";
import {useState} from "react";
import LinkCard from "@/app/components/LinkCard";
import {usePathname} from "next/navigation";
import {toast, Toaster} from "react-hot-toast";


export default function Home() {
    const [links, setLinks] = useState<{ originalLink: string, shortenLink: string }[]>([])



    const pathname = usePathname();
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
                            originalUrl: value.link
                        }
                    }
                )

                console.log(res.data);
                setLinks(prev => [...prev,
                    {originalLink: res.data.url, shortenLink: pathname + res.data.shortUrl}])

            } catch (e) {
                console.error(e)
            }

        },
    })

    async function handleDelete(shortenLink:string){
        await axios({
            method:"delete",
            url: process.env.NEXT_PUBLIC_API_KEY + `${shortenLink}`
        }).then(() => toast.success("Successfully deleted")).catch((e) => toast.error("Error" + e));
        setLinks(links.filter(value => value.shortenLink !== shortenLink))
    }

    const linkComponents = links.map((link, i) => {
        return <LinkCard key={i} originalLink={link.originalLink} shortenLink={link.shortenLink} handleDelete={() => handleDelete(link.shortenLink)}/>
    })

    return (
        <main className={"flex flex-col justify-center items-center gap-2"}>
            <Toaster/>
            <h1 className={"font-bold text-blue-500 text-5xl text-shadow-sm text-shadow-gray-300 m-6"}>Link Shortener </h1>
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
                    <button className={"p-2 text-white h-14 rounded-r-md bg-blue-500 text-center shadow-md shadow-blue-500 transition-shadow hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600"} type={"submit"}>Shorten Url</button>
                </form>
            </section>
            <section className={"flex flex-col gap-2"}>
                {linkComponents}
            </section>
        </main>
    );
}
