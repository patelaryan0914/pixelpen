import Banner from "../banner";
import Navbar from "./Navbar";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Banner />
      {children}
    </>
  );
}
