"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { notificationsFormSchema } from "@/lib/zod-schema";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateNotifications } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/icons";

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-3/5 mt-4"
      disabled={pending}
      aria-label="notifications"
    >
      {!pending ? (
        "Update Notifications"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};
export function NotificationsForm() {
  const [notifications, setNotifications] = useState({
    publisherEmails: true,
    socialEmails: false,
    marketingEmails: true,
    securityEmails: false,
  });
  const validateData = async () => {
    const result = await notificationsFormSchema.safeParseAsync(notifications);
    if (!result.success) {
      return;
    }
    const updatedResult = await updateNotifications(result.data);
    if (updatedResult?.status == 200)
      toast({ title: "Notifications Updated successfully." });
  };
  return (
    <>
      <form action={validateData} className="space-y-8">
        <div>
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex flex-col">
                <Label className="text-base">Blogs emails</Label>
                <span className="text-sm text-muted-foreground">
                  Stay upto date with new blogs published by your followed
                  publisher.
                </span>
              </div>
              <div>
                <Switch
                  defaultChecked={true}
                  onCheckedChange={(val) =>
                    setNotifications({
                      ...notifications,
                      publisherEmails: val,
                    })
                  }
                  name="publisherEmails"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5  flex flex-col">
                <Label className="text-base">Social emails</Label>
                <span className="text-sm text-muted-foreground">
                  Receive emails of follows, and more.
                </span>
              </div>
              <div>
                <Switch
                  defaultChecked={false}
                  name="socialEmails"
                  onCheckedChange={(val) =>
                    setNotifications({
                      ...notifications,
                      socialEmails: val,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex flex-col">
                <Label className="text-base">Marketing emails</Label>
                <span className="text-sm text-muted-foreground">
                  Receive email about top readed blogs once a week.
                </span>
              </div>
              <div>
                <Switch
                  defaultChecked={true}
                  name="marketingEmails"
                  onCheckedChange={(val) =>
                    setNotifications({
                      ...notifications,
                      marketingEmails: val,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex flex-col">
                <Label className="text-base">Security emails</Label>
                <span className="text-sm text-muted-foreground">
                  Receive emails about your account activity and security.
                </span>
              </div>
              <div>
                <Switch checked={true} name="securityEmails" disabled />
              </div>
            </div>
          </div>
          <Submit />
        </div>
      </form>
    </>
  );
}
