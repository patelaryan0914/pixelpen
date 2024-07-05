export default async function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="col-span-1 lg:col-span-2 xl:border border-r-gray-200">
      {children}
    </div>
  );
}
