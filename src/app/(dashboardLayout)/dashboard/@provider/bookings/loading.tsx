export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white selection:bg-green-300">
      <div className="absolute -bottom-20 -left-10 text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none select-none pointer-events-none transform -rotate-6">
        S Z
      </div>
      <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-lime-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="animate-pulse rounded-[2rem] border border-white/40 bg-white/70 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            <div className="h-4 w-44 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-9 w-72 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-white/40 bg-white/70 p-5 dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="mb-3 h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>

          <div className="animate-pulse rounded-[2rem] border border-white/40 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
              <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[2rem] border border-white/40 bg-white/75 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="h-7 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-10 w-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
