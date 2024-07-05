import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Card className="col-span-3 m-4 border-none shadow-none">
      <CardHeader>
        <CardTitle>Our Recommendations</CardTitle>
        <CardDescription>
          Read below blogs recommended by Pixel Pen
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
