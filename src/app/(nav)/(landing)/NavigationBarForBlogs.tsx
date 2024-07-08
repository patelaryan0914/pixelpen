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
const NavigationBarForBlogs = async () => {
  const tags = await prisma.tag.findMany({ select: { id: true, tag: true } });
  return (
    <div className="w-full my-5 flex sticky">
      <div className="w-2/5 hidden xl:block px-4 font-serif">
        Explore The World of Pixle Pen
      </div>
      <div className="w-full xl:w-3/5 flex justify-evenly items-center font-serif">
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
