import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/Navbar/navbar";
import { getUserInfo } from "@/services/auth.service";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();

  return (
    <>
      <Navbar initialUser={user} />
      <main className="min-h-[calc(100vh-4rem)] ">
        {children}
      </main>
      <Footer></Footer>
    </>
  );
}
