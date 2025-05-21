'use client'

import axios from "axios";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function RedirectionPage() {
    const {id} = useParams()
    const router = useRouter()



    async function redirectionFunc(){

        try{
            return await axios({
                method: "GET",
                url: process.env.NEXT_PUBLIC_API_KEY + `/${id}`
            })
        }
        catch (e){
            console.error(e)
        }
    }

    useEffect(() => {
        console.log(id);
        redirectionFunc().then((res) => router.replace(res?.data)).catch((e)=> console.error(e))
    }, [])

    return null;


}