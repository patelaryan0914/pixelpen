import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddInterestedTopics from "./AddInterestedTopics";
import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import { Button } from "@/components/ui/button";
const NavigationBarForBlogs = async () => {
  const session = await getSession();
  const tags = await prisma.tag.findMany({ select: { id: true, tag: true } });
  return (
    <div className="w-full my-5 flex justify-between sticky">
      <div className="w-2/5 hidden xl:block px-4 font-serif">
        Explore The World of Pixle Pen
      </div>
      <div className="w-full xl:w-3/5 flex justify-end items-center font-serif space-x-4 px-4">
        <Dialog>
          <DialogTrigger>
            <Plus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Your Favorite Topic.</DialogTitle>
              <DialogDescription>
                This can help us to recommend you the blogs.
              </DialogDescription>
            </DialogHeader>
            <AddInterestedTopics topics={tags} />
          </DialogContent>
        </Dialog>
        {session ? (
          <Link href="/following">Following</Link>
        ) : (
          <span className="text-gray-500 cursor-pointer">Following</span>
        )}
      </div>
    </div>
  );
};

export default NavigationBarForBlogs;
