import { Ghost, Heart } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { getSession, likes } from "@/app/actions";
import prisma from "@/lib/db";
const Like = async ({ blogId }: { blogId: string }) => {
  const session = await getSession();
  let isLiked = false;
  if (session) {
    isLiked = !!(await prisma.like.findFirst({
      where: {
        blogId,
        ownerId: session.userInfo.id,
      },
    }));
  }
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await likes(blogId);
        }}
      >
        <Button size="icon" variant="ghost">
          {isLiked ? (
            <Heart color="#ff0000" fill="red" />
          ) : (
            <Heart color="#374151" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default Like;
