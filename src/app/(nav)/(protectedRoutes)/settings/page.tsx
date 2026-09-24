import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
export default async function SettingsProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin");
  const user = await prisma.user.findUnique({
    where: { id: session.userInfo.id },
    select: { bio: true },
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Your name, photo, and a short bio readers see on stories.
        </p>
      </div>
      <Separator />
      <ProfileForm session={session} bio={user?.bio ?? ""} />
    </div>
  );
}
