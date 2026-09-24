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
      <Popover>
        <PopoverTrigger className="fixed bottom-6 right-6 ">
          <span
            className={buttonVariants({ variant: "default", size: "icon" })}
          >
            <MessageSquare />
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80 rounded-xl">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-medium">Feedback</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Feature requests and notes are always welcome.
            </p>
          </div>
          <ContactUsForm />
        </PopoverContent>
      </Popover>
      {children}
    </>
  );
}
