import { ForgotPasswordForm } from "@/components/modules/Auth/forgotPasswordForm";

export const metadata = {
  title: "Forgot Password | SZ",
  description: "Securely reset your account password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 transition-colors duration-500 dark:bg-slate-950">
      {/* Background Decorative Circles */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/5"></div>
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-600/10 blur-[100px] dark:bg-emerald-600/5"></div>

      <ForgotPasswordForm />
    </section>
  );
}