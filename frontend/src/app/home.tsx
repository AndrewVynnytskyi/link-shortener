"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { getCookie, setCookie } from "typescript-cookie";
import { nanoid } from "nanoid";
import { toast, Toaster } from "react-hot-toast";
import LinkCard from "@/app/components/LinkCard";
import PagComp from "@/app/components/PagComp";
import SignUpForm from "@/app/components/SignUpForm";
import LoginForm from "@/app/components/LoginForm";
import UrlShortSection from "@/app/components/UrlShortSection";

type Link = {
  url: string;
  shortUrl: string;
  clicks: number;
};

type Links = {
  total: number;
  urls: Link[];
};

export default function Home({ data }: { data: Links }) {
  const [links, setLinks] = useState<Link[]>(data.urls);
  const [total, setTotal] = useState<number>(data.total);
  const [page, setPage] = useState<number>(0);
  const pathname = usePathname();
  const signUpRef = useRef<HTMLElement>(null);
  const loginRef = useRef<HTMLElement>(null);
  const [userId, setUserId] = useState<string | undefined>();

  const handleSignUpForm = () => {
    if (signUpRef.current) {
      signUpRef.current.classList.remove("hidden");
    }
  };

  const handleLoginForm = () => {
    if (loginRef.current) {
      loginRef.current.classList.remove("hidden");
    }
  };

  useEffect(() => {
    if (getCookie("userId")) {
      setUserId(getCookie("userId"));
      return;
    }
    const userId = nanoid(4);
    setCookie("userId", userId);
    setUserId(userId);
  }, []);

  async function handleDelete(shortenLink: string) {
    console.log(shortenLink);
    setTotal((prev) => prev - 1);
    await axios({
      method: "delete",
      url: process.env.NEXT_PUBLIC_API_KEY + `${shortenLink}`,
    })
      .then(() => toast.success("Successfully deleted"))
      .catch((e) => toast.error("Error" + e));
    setPage(page);
    const res = await axios({
      method: "get",
      url: process.env.NEXT_PUBLIC_API_KEY + `/user/${userId}/${page}`,
    });
    setLinks(res.data.urls);
  }

  async function onPageChange(event: { selected: any }) {
    setPage(event.selected);
    const res = await axios({
      method: "get",
      url:
        process.env.NEXT_PUBLIC_API_KEY + `/user/${userId}/${event.selected}`,
    });
    setLinks(res.data.urls);
  }

  const linkComponents = links.map((link, i) => {
    return (
      <LinkCard
        key={i}
        originalLink={link.url}
        shortenLink={pathname + link.shortUrl}
        handleDelete={() => handleDelete(pathname + link.shortUrl)}
      />
    );
  });

  return (
    <main className={"flex flex-col items-center justify-center gap-2"}>
      <Toaster />
      <div
        className={
          "absolute top-2 right-2 flex items-center justify-center gap-2"
        }
      >
        <button
          onClick={handleLoginForm}
          className={
            "h-10 rounded-md bg-blue-500 p-2 text-center font-bold text-white shadow-md shadow-blue-500 transition-shadow hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600"
          }
        >
          Login
        </button>
        <button
          onClick={handleSignUpForm}
          className={
            "h-10 rounded-md bg-white p-2 text-center font-bold text-blue-500 shadow-md shadow-white transition-shadow hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-200"
          }
        >
          Sign Up
        </button>
      </div>
      <h1
        className={
          "m-6 text-5xl font-bold text-blue-500 text-shadow-gray-300 text-shadow-sm"
        }
      >
        Link Shortener{" "}
      </h1>
      <UrlShortSection
        page={page}
        setLinks={setLinks}
        setTotal={setTotal}
        userId={userId}
      />
      <section className={"flex flex-col gap-2"}>
        <PagComp
          currentItems={linkComponents}
          pageCount={Math.ceil(total / 10)}
          onPageChange={onPageChange}
        />
      </section>
      <SignUpForm ref={signUpRef} />
      <LoginForm ref={loginRef} />
    </main>
  );
}
