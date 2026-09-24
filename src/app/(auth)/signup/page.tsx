import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const Page = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Form panel */}
      <div className="order-2 flex items-center justify-center p-6 sm:p-10 lg:order-1">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email and password to create an account.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>

      {/* Branded illustration panel */}
      <div className="relative order-1 hidden overflow-hidden border-l bg-gradient-to-bl from-accent via-background to-accent p-10 lg:order-2 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 self-end text-lg font-semibold"
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
            src="/images/Signup.svg"
            alt="Person creating a PixelPen account"
            width={520}
            height={520}
            priority
            className="h-auto w-full max-w-md object-contain"
          />
        </div>

        <p className="relative z-10 max-w-sm self-end text-right text-sm leading-6 text-muted-foreground">
          Join PixelPen and start publishing your stories to readers everywhere.
        </p>
      </div>
    </div>
  );
};

export default Page;
