import { getSession } from "@/app/actions";
import { AuthRequiredError } from "@/lib/exceptions";
import prisma from "@/lib/db";
import { PageHeader, PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatedNumber } from "@/lib/numberFormater";
import { storyPath, storyTitle } from "@/lib/utils";
import Link from "next/link";
import { LineChartLabel } from "./components/line-chart";

function lastFourteenDays() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 13);

  return Array.from({ length: 14 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return {
      key: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      reads: 0,
    };
  });
}

const page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();

  const ownerId = session.userInfo.id;
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 13);

  const [storyCount, likeCount, commentCount, visitCount, visits, stories] =
    await Promise.all([
      prisma.blog.count({ where: { ownerId } }),
      prisma.like.count({ where: { blog: { ownerId } } }),
      prisma.comment.count({ where: { blog: { ownerId } } }),
      prisma.blogVisit.count({ where: { blog: { ownerId } } }),
      prisma.blogVisit.findMany({
        where: {
          visitedAt: { gte: since },
          blog: { ownerId },
        },
        select: { visitedAt: true },
      }),
      prisma.blog.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          headline: true,
          slug: true,
          status: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              blogvisit: true,
            },
          },
        },
      }),
    ]);

  const series = lastFourteenDays();
  const byDay = new Map(series.map((point) => [point.key, point]));
  for (const visit of visits) {
    const key = new Date(visit.visitedAt).toISOString().slice(0, 10);
    const point = byDay.get(key);
    if (point) point.reads += 1;
  }
  const chartData = series.map(({ label, reads }) => ({ label, reads }));
  const recentReads = visits.length;

  const stats = [
    { label: "Stories", value: storyCount },
    { label: "Reads", value: visitCount },
    { label: "Likes", value: likeCount },
    { label: "Comments", value: commentCount },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description="A quiet view of how your stories are landing with readers."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/70 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-3xl font-medium">
                {formatedNumber.format(stat.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8 border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Reads over time</CardTitle>
        </CardHeader>
        <LineChartLabel data={chartData} total={recentReads} />
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">By story</CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              Publish a story to start collecting analytics.
            </p>
          ) : (
            <div className="divide-y">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={storyPath(story)}
                      className="font-serif text-base font-medium hover:text-primary"
                    >
                      {storyTitle(story)}
                    </Link>
                    <p className="text-xs text-muted-foreground">{story.status}</p>
                  </div>
                  <div className="flex shrink-0 gap-4 text-xs text-muted-foreground">
                    <span>{formatedNumber.format(story._count.blogvisit)} reads</span>
                    <span>{formatedNumber.format(story._count.likes)} likes</span>
                    <span>
                      {formatedNumber.format(story._count.comments)} comments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default page;
