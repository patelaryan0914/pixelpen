import { getSession } from "@/app/actions";
import { AuthRequiredError } from "@/lib/exceptions";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Working on this page till than read blogs on homepage.
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Will make an announcement once this feature will be published.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className="text-sm font-semibold text-gray-900">
            Home Page
            <span aria-hidden="true" className="ml-2">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
