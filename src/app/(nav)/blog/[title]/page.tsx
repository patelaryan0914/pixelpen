import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";

const Blog = dynamic(() => import("./Blog"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const BlogDisplay = async ({ params }: { params: { title: string } }) => {
  const blog = await prisma.blog.findFirst({
    where: { title: params.title },
  });
  return (
    <div className="flex justify-center items-center">
      <Blog data={blog} />
    </div>
  );
};

export default BlogDisplay;
