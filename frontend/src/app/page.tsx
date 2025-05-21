'use client'

import {useForm} from "@tanstack/react-form";
import axios from "axios";
import {useState} from "react";
import LinkCard from "@/components/LinkCard";
import {usePathname} from "next/navigation";

export default function Home() {
    const [links, setLinks] = useState<{ originalLink: string, shortenLink: string }[]>([])
    const linkComponents = links.map((link, i) => {
        return <LinkCard key={i} originalLink={link.originalLink} shortenLink={link.shortenLink}/>
    })
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

    return (
        <main>
            <h1>Link Shortener </h1>
            <section>
                <h2>Paste the URL to be shortened</h2>
                <form onSubmit={(event) => {
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
                    <button type={"submit"}>Submit</button>
                </form>
            </section>
            <section>
                {linkComponents}
            </section>
        </main>
    );
}
