import axios from "axios";
import Home from "@/app/home";
import {cookies} from "next/headers";


export default async function Page() {
    const cookieStorage = await cookies()
    const userId = cookieStorage.get("userId") || null;
    if (!userId) {
        return (<Home data={[]}/>)
    }
    try {
        const res = await axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_API_KEY + `/user/${userId.value}/0`
        });
        return (<Home data={res.data}/>)
    } catch (e) {
        console.error(e);

    }
    return (<Home data={[]}/>)
}

