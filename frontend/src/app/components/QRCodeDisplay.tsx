import Link from "next/link";
import { RefObject } from "react";
import Overlay from "@/app/components/Overlay";

export default function QRCodeDisplay({ src, shortenLink, displayQRCodeRef }: {
  src: string,
  shortenLink: string,
  displayQRCodeRef: RefObject<HTMLDivElement | null>
}) {

  return (<Overlay ref={displayQRCodeRef}>
    {src && <img src={src} alt={"QrCode"} />}
    <Link href={"http://localhost:3000" + shortenLink}>{"http://localhost:3000" + shortenLink}</Link>
  </Overlay>);

}