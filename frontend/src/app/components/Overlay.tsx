import React, { RefObject } from "react";
import CloseButton from "@/app/components/CloseButton";

export default function Overlay({ children, ref }: { children: React.ReactNode, ref: RefObject<any> }) {

  return (<div ref={ref}
               className={"hidden flex justify-center items-center absolute inset-0 z-10  bg-gray-500/30 backdrop-blur-lg"}>
    <div className={"relative flex justify-center items-center flex-col bg-white opacity-100 z-20 p-4 rounded-md"}>
      <CloseButton ref={ref} />
      {children}
    </div>
  </div>);
}
