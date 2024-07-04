import NavigationBarForBlogs from "../NavigationBarForBlogs";
import { Separator } from "@/components/ui/separator";
export default async function Home({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col items-start justify-start">
      <div className="h-full grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
        <div className="col-span-1 xl:col-span-2 xl:border border-r-gray-200">
          <NavigationBarForBlogs />
          <Separator />
          {children}
        </div>
        {user}
      </div>
    </div>
  );
}
