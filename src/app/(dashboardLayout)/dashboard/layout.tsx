/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "@/app/constants/role";
import { jwtUtils } from "@/lib/jwtUtils";
import { getUserInfo } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "./components/DashboardHeader";


export default async function DashboardLayout({
  admin,
  provider,
  clinte,
}: {
  admin: React.ReactNode;
  provider: React.ReactNode;
  clinte: React.ReactNode;
}) {
  const user = await getUserInfo();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const decodedToken = accessToken ? jwtUtils.decodedToken(accessToken) : null;
  const tokenRole = String(decodedToken?.role || "").toUpperCase();

  if (!user && !decodedToken) {
    redirect("/login");
  }

  const rawRole = String(user?.role || tokenRole || "").toUpperCase();
  const userRole = rawRole === "ADMIN"
    ? Role.ADMIN
    : rawRole === "PROVIDER"
      ? Role.PROVIDER
      : Role.CLIENT;

  return (
    <DashboardHeader
      user={user}
      userRole={userRole}
      admin={admin}
      provider={provider}
      clinte={clinte}
    />
  );
}