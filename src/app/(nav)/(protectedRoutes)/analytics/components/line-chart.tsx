"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type ReadsPoint = {
  label: string;
  reads: number;
};

const chartConfig = {
  reads: {
    label: "Reads",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function LineChartLabel({
  data,
  total,
}: {
  data: ReadsPoint[];
  total: number;
}) {
  if (data.length === 0 || data.every((d) => d.reads === 0)) {
    return (
      <CardContent>
        <p className="py-10 text-center text-sm text-muted-foreground">
          No reads yet. They will show up here as people open your stories.
        </p>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="reads"
              type="monotone"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {total} {total === 1 ? "read" : "reads"} in the last 14 days
      </CardFooter>
    </>
  );
}
