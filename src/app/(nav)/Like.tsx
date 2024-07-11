import { Heart } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { getSession, likes } from "@/app/actions";
import prisma from "@/lib/db";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
const Like = async ({ blogId }: { blogId: string }) => {
  const session = await getSession();
  const likeAccess: boolean = session ? true : false;
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
        <HoverCard>
          {likeAccess ? (
            <Button
              size="icon"
              variant="ghost"
              disabled={!likeAccess}
              aria-label="likeaccess"
            >
              {isLiked ? (
                <Heart color="#ff0000" fill="red" />
              ) : (
                <Heart color="#374151" />
              )}
            </Button>
          ) : (
            <HoverCardTrigger>
              <Button
                size="icon"
                variant="ghost"
                disabled={!likeAccess}
                aria-label="likeaccess"
              >
                {isLiked ? (
                  <Heart color="#ff0000" fill="red" />
                ) : (
                  <Heart color="#374151" />
                )}
              </Button>
            </HoverCardTrigger>
          )}

          <HoverCardContent>User Must have an Account</HoverCardContent>
        </HoverCard>
      </form>
    </div>
  );
};

export default Like;
