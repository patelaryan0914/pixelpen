import Image from "next/image";
import Link from "next/link";
import SigninForm from "./SigninForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const Page = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Branded illustration panel */}
      <div className="relative hidden overflow-hidden border-r bg-gradient-to-br from-accent via-background to-accent p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 text-lg font-semibold"
        >
          <span className="flex h-8 w-14 items-center">
            <span className="h-4 w-4 rounded-full bg-primary/40" />
            <span className="-ml-1.5 h-5 w-5 rounded-full bg-primary/70" />
            <span className="-ml-1.5 h-6 w-6 rounded-full bg-primary" />
          </span>
          PixelPen
        </Link>

        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <Image
            src="/images/Signin.svg"
            alt="Person signing in to PixelPen"
            width={520}
            height={520}
            priority
            className="h-auto w-full max-w-md object-contain"
          />
        </div>

        <p className="relative z-10 max-w-sm text-sm leading-6 text-muted-foreground">
          Welcome back. Sign in to keep writing, reading, and sharing great
          stories on PixelPen.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to your account using your email.
            </p>
          </div>
          <SigninForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
