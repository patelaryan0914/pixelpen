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
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-6 md:px-8">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">{recommendations}</div>
        <aside className="hidden lg:sticky lg:top-28 lg:col-span-4 lg:block">
          {user}
        </aside>
      </div>
      {children}
    </main>
  );
}
