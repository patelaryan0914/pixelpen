import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
const NavigationBarForBlogs = () => {
  return (
    <div className="w-full my-5 flex sticky">
      <div className="w-2/5 hidden xl:block px-4 font-serif">
        Explore The World of Pixle Pen
      </div>
      <div className="w-full xl:w-3/5 flex justify-evenly items-center  font-serif">
        <Link href="/add">
          <Plus />
        </Link>
        <Link href="/forYou">For You</Link>
        <Link href="/following">Following</Link>
        <Link href="/nextjs">NextJs</Link>
        <Link href="/docker">Docker</Link>
        <Link href="/postgres">Postgres</Link>
      </div>
    </div>
  );
};

export default NavigationBarForBlogs;
