/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getAllServices } from "@/services/services.service";
import { Star, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function FeaturedServices() {
  let services: any[] = [];
  
  try {
    const response = await getAllServices({ page: 1, limit: 6 });
    services = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching featured services:", error);
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] py-20 sm:py-32">
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -bottom-20 -right-10 select-none text-[200px] md:text-[300px] font-black leading-none text-green-600/5 dark:text-green-500/5">
        SZ
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Featured <span className="text-green-600">Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular and highly-rated professional services
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-green-600 dark:hover:bg-green-600 hover:text-white dark:hover:text-white transition-all"
            >
              View All Services
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.length > 0 ? (
            services.map((service: any) => (
              <div
                key={service.id}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0F0F0F] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,197,94,0.1)]"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={service.imageUrl || "https://via.placeholder.com/400x300"}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-600 shadow-xl backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {service.specialty?.title || "Pro Service"}
                    </span>
                    <div className="flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {service.provider?.averageRating?.toFixed(1) || "5.0"}
                    </div>
                  </div>

                  <h3 className="mb-6 text-2xl font-black leading-tight tracking-tight group-hover:text-green-600 transition-colors line-clamp-1">
                    {service.name}
                  </h3>

                  {/* Provider Mini Info */}
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                    <Avatar className="h-8 w-8 border border-white dark:border-zinc-800">
                      <AvatarImage src={service.provider?.profilePhoto} />
                      <AvatarFallback>{service.provider?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{service.provider?.name}</span>
                      <span className="text-[10px] text-zinc-500">Professional Provider</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Starting Price</p>
                      <span className="text-2xl font-black text-black dark:text-white">
                        ৳{service.price}
                      </span>
                    </div>
                    <Link
                      href={`/services/${service.id}`}
                      className="rounded-2xl bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black transition-all hover:bg-green-600 dark:hover:bg-green-600 hover:text-white"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
