import Navbar from "@/components/modules/Navbar/navbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] ">
        {children}
      </main>
    </>
  );
}
