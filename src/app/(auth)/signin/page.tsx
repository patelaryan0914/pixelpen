import Image from "next/image";
import SigninForm from "./SigninForm";

const Page = () => {
  return (
    <div className="w-full h-screen lg:grid  lg:grid-cols-2 ">
      <div className="hidden bg-muted lg:block p-10">
        <Image
          src="/images/Signup.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-balance text-muted-foreground">
              Sign In to your Account using your Email.
            </p>
          </div>
          <SigninForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
