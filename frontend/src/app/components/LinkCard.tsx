import Link from "next/link";
import CopyToClipboard from "@/assets/CopyToClipboard";
import {toast} from "react-hot-toast";
import QRCode from "qrcode";
import {useRef, useState} from "react";
import GenerateQrCode from "@/assets/GenerateQrCode";
import TrashIcon from "@/assets/TrashIcon";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";


export default function LinkCard({originalLink, shortenLink, handleDelete} : {originalLink: string, shortenLink:string, handleDelete:any}){

    const displayQRCodeRef = useRef<HTMLDivElement|null>(null);
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText('http://localhost:3000' + shortenLink)
            .then(() => toast.success("Successfully copied"))
            .catch((e) => toast.error("Error" + e));
    };
    const [src, setSrc] = useState<string>("");


    const handleQRCodeGeneration = () => {
        QRCode.toDataURL('http://localhost:3000' + shortenLink)
            .then((url)=> {
                setSrc(url);
                if (displayQRCodeRef.current) {
                    displayQRCodeRef.current.classList.remove("hidden");
                }
            })
            .catch((e) => toast.error("Error" + e));
    }



    return(<>
            <section className={"gap-8 p-4 flex justify-between items-center bg-white rounded-sm w-[750px]"}>
                <div className={"flex-col justify-between w-[300px]"}>
                    <p className={"text-gray-400 text-sm"}>Destination Url</p>
                    <p className={"text-black text-md"}>{originalLink}</p>
                </div>
                <div className={"flex-col w-[400px]"}>
                        <p className={"text-gray-400 text-sm"}>Your shortened link</p>
                    <div className={"flex flex-row items-center"}>
                        <Link className={"text-blue-600 text-md pr-1"}
                              href={'http://localhost:3000' + shortenLink}>{'http://localhost:3000' + shortenLink}</Link>
                        <button className={"items-center p-1 stroke-gray-400 h-full bg-transparent rounded-md border-none hover:stroke-blue-600 hover:bg-blue-200 hover:bg-opacity-10"} onClick={() => handleCopyToClipboard()}><CopyToClipboard/></button>
                        <button className={"items-center p-0.45 fill-gray-400 h-full bg-transparent rounded-md border-none hover:fill-blue-600 hover:bg-blue-200 hover:bg-opacity-10"} onClick={() => handleQRCodeGeneration()}><GenerateQrCode/></button>
                        <button className={"items-center p-1 fill-gray-400 h-full bg-transparent rounded-md border-none hover:fill-blue-600 hover:bg-blue-200 hover:bg-opacity-10"} onClick={() => handleDelete()} ><TrashIcon/></button>
                    </div>

                </div>
            </section>
            <QRCodeDisplay src={src} shortenLink={shortenLink} displayQRCodeRef={displayQRCodeRef}/>
        </>
    )
}