"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/auth-context";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/");
  }

  return (
    <header className="border-border flex w-full items-center justify-between border-b px-4 py-3 sm:px-8">
      <Link href="/" className="text-primary text-lg font-bold">
        Link Shortener
      </Link>
      <nav className="flex items-center gap-2">
        <ThemeToggle />
        {!isLoading && user && (
          <>
            <Link
              href="/my-links"
              className="text-foreground hover:text-primary px-2 text-sm font-medium"
            >
              My Links
            </Link>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </>
        )}
        {!isLoading && !user && (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Sign up
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
