export default async function LandingLayout({
  children,
  user,
  recommendations,
}: Readonly<{
  children: React.ReactNode;
  user: React.ReactNode;
  recommendations: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col items-start justify-start">
      <div className="h-full grid w-full grid-cols-1 lg:grid-cols-3  gap-6 ">
        <div className="col-span-1 lg:col-span-2 xl:border border-r-gray-200">
          {recommendations}
        </div>
        <div className="hidden lg:block lg:col-span-1">{user}</div>
      </div>
    </div>
  );
}
