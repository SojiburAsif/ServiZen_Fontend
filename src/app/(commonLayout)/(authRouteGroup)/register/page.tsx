import RegisterForm from "@/components/modules/Auth/registerForm";

export default function RegisterPage() {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-6
      bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279]
      dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05]"
    >
      <div className="pointer-events-none absolute -bottom-24 -left-16 select-none text-[180px] md:text-[260px] lg:text-[360px] font-extrabold leading-none tracking-wide text-emerald-800/10 dark:text-emerald-500/10">
        S Z
      </div>

      <div className="absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="absolute left-0 bottom-0 h-[250px] w-[250px] rounded-full bg-green-400/10 blur-[110px]" />

      <div className="relative z-10 w-full max-w-xl lg:max-w-2xl">
        <RegisterForm />
      </div>
    </section>
  );
}
