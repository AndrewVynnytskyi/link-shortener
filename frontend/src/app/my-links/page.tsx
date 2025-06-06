import { router } from "next/client";
import { cookies } from "next/headers";
import axios from "axios";
import MyLinks from "@/app/my-links/MyLinks";
import { redirect } from "next/navigation";



export default async function Page() {

  const cookieStorage = await cookies();

  const jwtToken = cookieStorage.get("jwt-token");
  if (!jwtToken) {
    redirect("/");
  }

  try {
    const res = await axios({
        method: "get",
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        },
        url: process.env.NEXT_PUBLIC_API_KEY + "/logged-user/0"
      }
    );
    console.log(res.data)
    return <MyLinks data={res.data}/>
  } catch (error) {
    console.error(error);
    redirect("/");
  }


}
