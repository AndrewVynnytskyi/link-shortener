import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = { title: "Log in — Link Shortener" };

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <h1 className="text-foreground mb-6 text-2xl font-bold">Log in</h1>
      <LoginForm />
      <p className="text-muted mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
