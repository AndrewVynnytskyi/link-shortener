import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const metadata = { title: "Sign up — Link Shortener" };

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <h1 className="text-foreground mb-6 text-2xl font-bold">Sign up</h1>
      <SignUpForm />
      <p className="text-muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </Card>
  );
}
