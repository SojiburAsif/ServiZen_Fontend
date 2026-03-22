import { cookies } from "next/headers";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
  admin: React.ReactNode;
  provider: React.ReactNode;
  clinte: React.ReactNode;
}>;

 
export default function DashboardParallelLayout({
  children,
  admin,
  provider,
  clinte,
}: DashboardLayoutProps) {



}
