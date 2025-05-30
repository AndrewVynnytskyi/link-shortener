import Link from "next/link";
import CopyToClipboard from "@/assets/CopyToClipboard";
import { toast } from "react-hot-toast";
import QRCode from "qrcode";
import { useRef, useState } from "react";
import GenerateQrCode from "@/assets/GenerateQrCode";
import TrashIcon from "@/assets/TrashIcon";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";

export default function LinkCard({
  originalLink,
  shortenLink,
  handleDelete,
}: {
  originalLink: string;
  shortenLink: string;
  handleDelete: any;
}) {
  const displayQRCodeRef = useRef<HTMLDivElement | null>(null);
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText("http://localhost:3000" + shortenLink)
      .then(() => toast.success("Successfully copied"))
      .catch((e) => toast.error("Error" + e));
  };
  const [src, setSrc] = useState<string>("");

  const handleQRCodeGeneration = () => {
    QRCode.toDataURL("http://localhost:3000" + shortenLink)
      .then((url) => {
        setSrc(url);
        if (displayQRCodeRef.current) {
          displayQRCodeRef.current.classList.remove("hidden");
        }
      })
      .catch((e) => toast.error("Error" + e));
  };

  return (
    <>
      <section
        className={
          "flex w-[750px] items-center justify-between gap-8 rounded-sm bg-white p-4"
        }
      >
        <div className={"w-[300px] flex-col justify-between"}>
          <p className={"text-sm text-gray-400"}>Destination Url</p>
          <p className={"text-md text-black"}>{originalLink}</p>
        </div>
        <div className={"w-[400px] flex-col"}>
          <p className={"text-sm text-gray-400"}>Your shortened link</p>
          <div className={"flex flex-row items-center"}>
            <Link
              className={"text-md pr-1 text-blue-600"}
              href={"http://localhost:3000" + shortenLink}
            >
              {"http://localhost:3000" + shortenLink}
            </Link>
            <button
              className={
                "hover:bg-opacity-10 h-full items-center rounded-md border-none bg-transparent stroke-gray-400 p-1 hover:bg-blue-200 hover:stroke-blue-600"
              }
              onClick={() => handleCopyToClipboard()}
            >
              <CopyToClipboard />
            </button>
            <button
              className={
                "p-0.45 hover:bg-opacity-10 h-full items-center rounded-md border-none bg-transparent fill-gray-400 hover:bg-blue-200 hover:fill-blue-600"
              }
              onClick={() => handleQRCodeGeneration()}
            >
              <GenerateQrCode />
            </button>
            <button
              className={
                "hover:bg-opacity-10 h-full items-center rounded-md border-none bg-transparent fill-gray-400 p-1 hover:bg-blue-200 hover:fill-blue-600"
              }
              onClick={() => handleDelete()}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </section>
      <QRCodeDisplay
        src={src}
        shortenLink={shortenLink}
        displayQRCodeRef={displayQRCodeRef}
      />
    </>
  );
}
