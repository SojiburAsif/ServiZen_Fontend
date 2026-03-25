import { VerifyEmailForm } from "@/components/modules/Auth/verifyEmailForm";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] px-4 py-12 font-sans selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      
      {/* Background Large Text "S Z" - Beka (Rotated) */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 select-none text-[250px] font-bold leading-none text-green-800/5 transition-all transform -rotate-12 dark:text-green-400/5 md:text-[450px]">
        S Z
      </div>

      {/* Decorative Blur */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-green-400/10 blur-[100px] dark:bg-green-900/10"></div>

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-green-700 animate-pulse text-center">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </section>
  );
}