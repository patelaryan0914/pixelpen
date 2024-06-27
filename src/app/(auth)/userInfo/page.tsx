import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/app/actions";
import { AuthRequired } from "@/lib/exceptions";

const TeamMember = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequired();
  return (
    <Card className="w-[380px] sm:w-[450px] ">
      <CardHeader>
        <CardTitle>Hello, Welcome to Blend</CardTitle>
        <CardDescription>
          Update Your username and avatar and start publishing your blog.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">{session.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
