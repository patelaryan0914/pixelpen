import { Blog, User } from "@/app/types";
import { CircleUser, MessageSquareText } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/db";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { getSession, subscribe } from "@/app/actions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Like from "../Like";
import { formatedNumber } from "@/lib/numberFormater";
import { getFirstImageUrl, getFirstStringFromArray } from "@/lib/utils";
const RecommendationCard = async ({ data }: { data: Blog }) => {
  const session = await getSession();
  const followAccess: boolean = session ? true : false;
  const owner: User | null = await prisma.user.findUnique({
    where: { id: data.ownerId },
    include: {
      _count: {
        select: { subscriptionsAsPublisher: true },
      },
    },
  });
  const tags = data?.tags!;
  let isSubscribed = false;
  if (session) {
    isSubscribed = !!(await prisma.subscription.findFirst({
      where: {
        publisherId: data.ownerId,
        readerId: session.userInfo.id,
      },
    }));
  }
  return (
    <div className=" mx-auto my-10 sm:col-span-1 w-4/5 rounded-3xl ring-1 ring-gray-200 md:col-span-2 flex flex-col lg:flex-row lg:justify-between">
      <div className="p-6 sm:p-8 w-full flex flex-col justify-between lg:w-3/5">
        <Link href={`/blog/${data.title}`} className="w-full">
          <h3 className="text-2xl font-bold tracking-tight text-primary">
            {getFirstStringFromArray(data.content, "header")}
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600 line-clamp-3 3xl:line-clamp-4 ">
            {getFirstStringFromArray(data.content, "paragraph")}
          </p>
        </Link>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
            Author
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
        </div>
        <div className="mt-4 flex items-center justify-between space-x-4">
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex items-center space-x-4">
                {owner?.avatar === null ? (
                  <CircleUser className="h-8 w-8 text-black " />
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={owner?.avatar}
                      width={500}
                      height={500}
                      alt="Image"
                    />
                  </Avatar>
                )}
                <div>
                  <p className="text-sm font-medium leading-none">
                    {owner?.username}
                  </p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="top">
              <div className="flex flex-col justify-center items-start">
                <div className="w-full flex justify-between items-center">
                  <div>
                    {owner?.avatar === null ? (
                      <CircleUser className="h-14 w-14 text-black " />
                    ) : (
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src={owner?.avatar}
                          width={500}
                          height={500}
                          alt="Image"
                        />
                      </Avatar>
                    )}
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await subscribe(owner?.id!);
                    }}
                  >
                    <Button type="submit" size="sm" disabled={!followAccess}>
                      {isSubscribed ? "Unfollow" : "Follow"}
                    </Button>
                  </form>
                </div>
                <div>
                  <p className="mt-2 text-sm font-medium text-left">
                    {owner?.username}
                  </p>
                </div>
                <div>
                  <p className="mt-2 text-sm font-medium text-left">
                    {formatedNumber.format(
                      owner?._count?.subscriptionsAsPublisher!
                    ) + " "}
                    Followers
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium leading-none space-x-1">
              <div>
                <Like blogId={data?.id} />
              </div>
              <p className="text-xs">
                {formatedNumber.format(data?._count?.likes!)}
              </p>
            </div>
            <div className="flex items-center text-sm font-medium leading-none space-x-1">
              <div>
                <MessageSquareText color="#374151" />
              </div>
              <p className="text-xs">
                {formatedNumber.format(data?._count?.comments!)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          {tags.length > 0
            ? tags.map((val: { tag: string }, index: number) => (
                <Badge variant="outline" key={index}>
                  {val.tag}
                </Badge>
              ))
            : ""}
        </div>
      </div>
      <div className="p-6 sm:p-8 w-full lg:mt-0 lg:w-2/5 lg:max-w-md lg:flex-shrink-0 min-h-fit flex justify-center items-center">
        <div className="h-full rounded-2xl text-center flex items-center">
          <Image
            src={getFirstImageUrl(data.content)}
            width={500}
            height={500}
            alt="Image"
            className="rounded-sm "
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
