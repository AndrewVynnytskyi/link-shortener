import React, { RefObject } from "react";
import CloseButton from "@/app/components/CloseButton";

export default function Overlay({
  children,
  ref,
  className
}: {
  children: React.ReactNode;
  ref: RefObject<any>;
  className: string
}) {
  return (
    <div
      ref={ref}
      className={
        "absolute inset-0 z-10 flex hidden items-center justify-center bg-gray-500/30 backdrop-blur-lg"
      }
    >
      <div
        className={
          `relative z-20 flex flex-col items-center justify-center rounded-md bg-white p-4 opacity-100 ${className}`
        }
      >
        <CloseButton ref={ref} />
        {children}
      </div>
    </div>
  );
}
