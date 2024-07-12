import Banner from "../banner";
import Navbar from "./Navbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import ContactUsForm from "../contactUsForm";
export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Banner />
      <Popover>
        <PopoverTrigger className="fixed bottom-6 right-6 ">
          <span
            className={buttonVariants({ variant: "default", size: "icon" })}
          >
            <MessageSquare />
          </span>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg ">
          <div className="mt-2 mb-7 h-full w-full flex flex-col items-center justify-center ">
            <h1 className=" text-3xl font-black">Feedback</h1>
            <span className="text-xs mt-1">
              Your valueable feedback or feature request are always welcomed.
            </span>
          </div>
          <ContactUsForm />
        </PopoverContent>
      </Popover>
      {children}
    </>
  );
}
