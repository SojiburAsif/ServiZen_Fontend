import LoginForm from "@/components/modules/Auth/loginForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertAction } from "@/components/ui/alert-action";
import { InfoIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-2 py-4 transition-colors duration-500
      bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05]
      text-gray-900 dark:text-white font-sans selection:bg-green-300">
      {/* Background Large Text "S Z" */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[180px] font-bold leading-none text-emerald-800/5 transition-all dark:text-emerald-500/5 md:text-[320px] lg:text-[500px]">
        S Z
      </div>
      {/* Background Decorative Gradients */}
      <div className="absolute -right-20 -top-20 h-72 w-72 md:h-96 md:w-96 rounded-full bg-emerald-500/10 blur-[90px] md:blur-[120px] dark:bg-emerald-600/5"></div>
      <div className="relative z-10 w-full flex justify-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}