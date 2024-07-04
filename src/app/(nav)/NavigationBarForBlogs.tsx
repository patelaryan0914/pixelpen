import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
const NavigationBarForBlogs = () => {
  return (
    <div className="w-full my-5 flex ">
      <div className="w-2/5 hidden xl:block px-4 font-serif">
        Explore The World of Pixle Pen
      </div>
      <div className="w-full xl:w-3/5 flex justify-evenly items-center  font-serif">
        <Link href="/heloo">
          <Plus />
        </Link>
        <Link href="/heloo">For You</Link>
        <Link href="/heloo">Following</Link>
        <Link href="/heloo">NextJs</Link>
        <Link href="/heloo">Docker</Link>
        <Link href="/heloo">Postgres</Link>
      </div>
    </div>
  );
};

export default NavigationBarForBlogs;
