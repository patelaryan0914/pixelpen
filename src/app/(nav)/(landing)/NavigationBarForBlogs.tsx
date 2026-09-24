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
    <div className="flex w-full items-center justify-between gap-4 px-4 py-4">
      <h2 className="hidden font-serif text-lg font-medium tracking-tight text-foreground xl:block">
        Explore the world of PixelPen
      </h2>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
              aria-label="Add a favorite topic"
            >
              <Plus className="h-4 w-4" />
              <span>Topics</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add your favorite topics</DialogTitle>
              <DialogDescription>
                This helps us recommend stories you&apos;ll enjoy.
              </DialogDescription>
            </DialogHeader>
            <AddInterestedTopics topics={tags} />
          </DialogContent>
        </Dialog>
        {session ? (
          <Link
            href="/following"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Following
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground/50">
            Following
          </span>
        )}
      </div>
    </div>
  );
};

export default NavigationBarForBlogs;
