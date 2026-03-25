export default function CommonProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  );
}
