import { Blog, User } from "@/app/types";
import { CircleUser, Heart, MessageSquareText } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";
import prisma from "@/lib/db";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
const RecommendationCard = async ({ data }: { data: Blog }) => {
  const owner: User | null = await prisma.user.findUnique({
    where: { id: data.ownerId },
    include: {
      _count: {
        select: { subscriptionsAsPublisher: true },
      },
    },
  });
  console.log(owner);
  return (
    <div className="h-full grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
      <div className="mx-auto mt-10 w-4/5 sm:col-span-1 rounded-3xl ring-1 ring-gray-200 md:col-span-2 grid grid-cols-1 sm:grid-cols-3">
        <div className="p-6 sm:p-8 lg:flex-auto col-span-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {data.title.charAt(0).toUpperCase() +
              data.title.slice(1).replaceAll("-", " ")}
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600 line-clamp-3">
            {
              data.content.filter((val: any) => val.type == "paragraph")[0]
                .content[0].text
            }
          </p>
          <div className="mt-6 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
              What’s included
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
                      <AvatarImage src={owner?.avatar} alt="Image" />
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
                          <AvatarImage src={owner?.avatar} alt="Image" />
                        </Avatar>
                      )}
                    </div>
                    <Button size="sm">Follow </Button>
                  </div>
                  <div>
                    <p className="mt-2 text-sm font-medium text-left">
                      {owner?.username}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium leading-none space-x-1">
                <div>
                  <Heart color="#374151" />
                </div>
                <p className="text-xs">2.2k</p>
              </div>
              <div className="flex items-center text-sm font-medium leading-none space-x-1">
                <div>
                  <MessageSquareText color="#374151" />
                </div>
                <p className="text-xs">2.2k</p>
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-2 p-6 sm:p-8  h-full lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 min-h-fit">
          <div className="h-full rounded-2xl  text-center lg:flex lg:flex-col lg:justify-center">
            <Image
              src={
                data.content.filter((val: any) => val.type == "image")[0]?.props
                  .url
              }
              width={500}
              height={500}
              alt="Image"
              className="rounded-sm bg-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
