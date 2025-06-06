import axios from "axios";
import { useEffect, useState } from "react";

export default function UrlInformationSection({ url = "", shortUrl }: { url: string, shortUrl: string }) {

  const [title, setTitle] = useState<string>("");

  async function getPageTitle() {
    try {
      console.log(process.env.NEXT_PUBLIC_API_KEY + "/information");
      const res = await axios({
        method: "get",
        url: process.env.NEXT_PUBLIC_API_KEY + `/information?url=${encodeURIComponent(url)}`,
      });
      const title = res.data;
      setTitle(title || "name");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getPageTitle().catch(e => console.error(e));
  }, [url]);

  return (<table>
    <tbody>
    <tr>
      <th>Branded Link</th>
      <td>{shortUrl}</td>
    </tr>
    <tr>
      <th>Name</th>
      <td>{title}</td>
    </tr>
    </tbody>
  </table>);
}
