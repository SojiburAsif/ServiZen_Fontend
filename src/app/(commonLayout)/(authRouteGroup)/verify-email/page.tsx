import { VerifyEmailForm } from "@/components/modules/Auth/verifyEmailForm";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center justify-center">
        <VerifyEmailForm />
      </div>
    </section>
  );
}
