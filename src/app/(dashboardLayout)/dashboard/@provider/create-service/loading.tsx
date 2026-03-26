import { DashboardHeaderSkeleton, DashboardFormSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function ProviderCreateServiceLoading() {
  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] font-sans selection:bg-green-300">
      
      {/* --- Noise Filter Overlay --- */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* --- Content Overlay --- */}
      <section className="relative z-10 space-y-8 p-6 max-w-7xl mx-auto">
        
        {/* Header Skeleton */}
        <div className="opacity-70">
          <DashboardHeaderSkeleton showBadge descriptionLines={2} actionCount={1} />
        </div>

        {/* Form Container with Glassmorphism Shimmer */}
        <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-2xl shadow-green-900/5 overflow-hidden">
          <div className="opacity-50 animate-pulse">
            <DashboardFormSkeleton />
          </div>
        </div>
        
      </section>

      {/* Background Decorative Glow (Subtle) */}
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-green-400/10 blur-[100px] pointer-events-none" />
    </div>
  );
}