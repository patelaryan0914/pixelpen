import NavigationBarForBlogs from "../NavigationBarForBlogs";
import { Separator } from "@/components/ui/separator";
export default async function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="col-span-1 lg:col-span-2 ">
      <NavigationBarForBlogs />
      <Separator />
      {children}
    </div>
  );
}
