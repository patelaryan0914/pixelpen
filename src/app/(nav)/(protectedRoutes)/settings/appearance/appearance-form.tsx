"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/icons";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-2/5 mt-4"
      disabled={pending}
      aria-label="saveuserinfo"
    >
      {!pending ? (
        "Update preferences"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};
export function AppearanceForm() {
  const validateData = (formatData: FormData) => {};

  return (
    <>
      <form action={validateData} className="space-y-8">
        <div className="space-y-1">
          <div className="space-y-0.5 flex flex-col">
            <Label className="text-base">Theme</Label>
            <span className="text-sm text-muted-foreground">
              Select the theme for the dashboard.
            </span>
          </div>
          <RadioGroup
            onValueChange={(val) => console.log(val)}
            name="theme"
            defaultValue={"light"}
            className="grid max-w-md grid-cols-2 gap-8 pt-2"
          >
            <div>
              <Label className="[&:has([data-state=checked])>div]:border-primary">
                <div>
                  <RadioGroupItem value="light" className="sr-only" />
                </div>
                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Light
                </span>
              </Label>
            </div>
            <div>
              <Label className="[&:has([data-state=checked])>div]:border-primary">
                <div>
                  <RadioGroupItem value="dark" className="sr-only" />
                </div>
                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Dark
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Submit />
      </form>
    </>
  );
}
