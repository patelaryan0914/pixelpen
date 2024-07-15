"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { ArrowLeftIcon, CalendarClockIcon } from "lucide-react";
import { LineChartLabel } from "./components/line-chart";
import { getSession } from "@/app/actions";
import { AuthRequiredError } from "@/lib/exceptions";
import prisma from "@/lib/db";
export default async function Page() {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  const data = await prisma.blog.findMany({
    where: { ownerId: session.userInfo.id },
  });
  console.log(data);
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="font-semibold text-lg md:text-xl">Blog Analytics</h1>
          {/* <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex">
              Today
            </Button>
            <Button variant="outline" className="hidden md:flex">
              This Week
            </Button>
            <Button variant="outline" className="hidden md:flex">
              This Month
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarClockIcon className="mr-2 h-4 w-4" />
                  June 01, 2023 - June 30, 2023
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="range" numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div> */}
        </div>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Total Blog Posts</CardDescription>
                <CardTitle>342</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartLabel />
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Total Views</CardDescription>
                <CardTitle>1.2M</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartLabel />
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardDescription>Subscriptions</CardDescription>
                <CardTitle>342</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartLabel />
              </CardContent>
            </Card>
          </div>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Blog Post Analytics</CardTitle>
              <CardDescription>
                Detailed analytics for your blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Views
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Shares
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Traffic Source
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">
                        The Future of Web Development
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published on June 15, 2023
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      12,345
                    </TableCell>
                    <TableCell className="hidden md:table-cell">345</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        Google Search
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">
                        The Rise of Artificial Intelligence
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published on June 10, 2023
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      9,876
                    </TableCell>
                    <TableCell className="hidden md:table-cell">234</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        Social Media
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">
                        The Impact of Remote Work
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published on June 5, 2023
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      7,654
                    </TableCell>
                    <TableCell className="hidden md:table-cell">156</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        Direct
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">
                        The Future of Blockchain Technology
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published on June 1, 2023
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      5,432
                    </TableCell>
                    <TableCell className="hidden md:table-cell">98</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        Social Media
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> blog posts
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
