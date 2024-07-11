import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
const notFound = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          No matching Routes Found
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className={buttonVariants({ variant: "outline" })}
            aria-label="homepage"
          >
            Go to Home Page{" "}
            <span aria-hidden="true" className="ml-2">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default notFound;
