"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTags from "./AddTags";
import { deleteBlog } from "@/app/actions";
import Delete from "./Delete";
import Link from "next/link";
import { Blog } from "@/app/types";
import { cn, storyPath, storyTitle } from "@/lib/utils";

const ManageBlog = ({
  data,
  options,
}: {
  data: Blog[];
  options: { tag: string }[];
}) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Draft", "Published", "Scheduled"] as const;
  const rows =
    filter === "All" ? data : data.filter((blog) => blog.status === filter);

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Library</CardTitle>
        <CardDescription>
          Continue a draft, edit a live story, or check what is scheduled.
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                filter === item
                  ? "bg-primary text-primary-foreground"
                  : "border bg-muted/60 text-muted-foreground"
              )}
            >
              {item === "All" ? "All" : item === "Draft" ? "Drafts" : item}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((blog: Blog) => {
              const cover = blog.coverUrl || blog.images?.[0]?.imageUrl;
              const label = storyTitle(blog);
              return (
                <TableRow key={blog.id}>
                  <TableCell className="hidden sm:table-cell">
                    {cover ? (
                      <Image
                        alt={label}
                        className="aspect-square rounded-md object-cover"
                        height={64}
                        src={cover}
                        width={64}
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-serif text-base font-medium">
                    <Link
                      href={storyPath(blog)}
                      className="hover:text-primary"
                    >
                      {label}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {blog.status === "Scheduled" && blog.publishAt
                        ? `${new Date(blog.publishAt).getTime() <= Date.now() ? "Live" : "Scheduled"} · ${new Date(blog.publishAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags && blog.tags.length > 0 ? (
                        blog.tags.map((tags: { tag: string }, index: number) => (
                          <Badge variant="outline" key={index}>
                            {tags.tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No tags
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            aria-label="menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/edit-blog/${blog.id}`}>
                              {blog.status === "Draft"
                                ? "Continue writing"
                                : "Edit story"}
                            </Link>
                          </DropdownMenuItem>
                          {blog.status !== "Draft" && (
                            <DropdownMenuItem asChild>
                              <Link href={storyPath(blog)}>View</Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <DialogTrigger>Add tags</DialogTrigger>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <form
                              action={deleteBlog.bind(null, blog.id)}
                              className="w-full"
                            >
                              <Delete />
                            </form>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add tags</DialogTitle>
                          <DialogDescription>
                            Tags help readers find stories they care about.
                          </DialogDescription>
                        </DialogHeader>
                        <AddTags
                          blogId={blog.id}
                          defaultTags={blog.tags ?? []}
                          options={options}
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No stories yet. Publish your first one from Write.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Showing <strong>{rows.length}</strong>{" "}
          {rows.length === 1 ? "story" : "stories"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ManageBlog;
