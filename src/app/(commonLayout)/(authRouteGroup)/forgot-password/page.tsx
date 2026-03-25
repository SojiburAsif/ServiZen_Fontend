import { ForgotPasswordForm } from "@/components/modules/Auth/forgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
