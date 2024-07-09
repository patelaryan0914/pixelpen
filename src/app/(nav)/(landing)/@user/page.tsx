import { Blog } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/db";
import { displayTitle } from "@/lib/utils";
import Link from "next/link";

export default async function page() {
  const blogs = await prisma.blog.findMany({
    select: { id: true, title: true, owner: true, images: true },
  });
  return (
    <div className="">
      <div className="flex flex-col items-start">
        {blogs
          .filter((val) => val.owner.avatar !== null)
          .map((val: Blog) => (
            <div key={val.id}>
              <div className="flex flex-col justify-center my-2">
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${val.title}`}
                  className="hover:underline underline-offset-2"
                >
                  {displayTitle(val.title)}
                </Link>
                <div className="flex flex-row items-center mt-2">
                  <div>
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={val?.owner?.avatar!}
                        width={500}
                        height={500}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {val?.owner?.username![0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {val?.owner?.username!}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
