import {Cross} from "next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/next-logo";
import Link from "next/link";
import {RefObject} from "react";

export default function QRCodeDisplay({src, shortenLink, displayQRCodeRef}: {src:string, shortenLink:string, displayQRCodeRef: RefObject<HTMLDivElement|null>} ){

    return (<div ref={displayQRCodeRef}
                 className={"hidden flex justify-center items-center absolute inset-0 z-10  bg-gray-500/30 backdrop-blur-lg"}>
        <div className={"relative flex justify-center items-center flex-col bg-white opacity-100 z-20 p-4 rounded-md"}>
            <button
                className={"p-2 absolute rounded-full bg-blue-500/30 stroke-blue-600 top-2 right-2 hover:bg-blue-500/20"}
                onClick={() => displayQRCodeRef.current?.classList.add("hidden")}><Cross/></button>
            {src && <img src={src} alt={"QrCode"}/>}
            <Link href={'http://localhost:3000' + shortenLink}>{'http://localhost:3000' + shortenLink}</Link>
        </div>
    </div>)
}