import NavigationBarForBlogs from "../NavigationBarForBlogs";
import { Separator } from "@/components/ui/separator";
export default async function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationBarForBlogs />
      <Separator />
      {children}
    </>
  );
}
