import { getLoggedInUserProfile } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, ShieldCheck, Star, User, CalendarDays, BadgeCheck } from "lucide-react";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default async function MyProfilePage() {
  const profile = await getLoggedInUserProfile();
  const client = profile?.client;

  if (!profile || !client) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading profile...</p>
      </main>
    );
  }

  const reviews = client.reviews || [];
  const bookings = client.bookings || [];

  const membershipDate = formatDate(profile.createdAt);
  const phone = client.contactNumber ?? "Not provided";
  const address = client.address ?? "Address not set";
  const city = client.city;
  const primaryEmail = profile.email || "No email";
  const accountRole = profile.role.toUpperCase();
  const isVerified = profile.emailVerified;
  const reviewsPreview = reviews.slice(0, 2);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-12 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-lime-400/20 blur-[140px] dark:bg-lime-500/10" />
      </div>
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 dark:text-emerald-300">Client Profile</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {client.name || profile.name || "Guest"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">Member since {membershipDate}</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="size-10" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">Account Status</p>
                <p className="text-lg font-black">{profile.status || "ACTIVE"}</p>
                <p className="text-xs">Email verified {isVerified ? "Yes" : "Pending"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Contact & Location</p>
              <Badge variant="secondary" className="rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                ACTIVE
              </Badge>
            </div>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-100">
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Phone</p>
                  <p className="font-semibold">{phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Address</p>
                  <p className="font-semibold">{address}</p>
                </div>
              </div>
              {city ? (
                <div className="flex items-center gap-3">
                  <CalendarDays className="size-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">City</p>
                    <p className="font-semibold">{city}</p>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Email</p>
                  <p className="font-semibold">{primaryEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Status Snapshot</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-300">Total Bookings</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{bookings.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-300">Total Reviews</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{reviews.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-300">Account Role</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{accountRole}</dd>
              </div>
            </dl>
          </div>
        </section>

        {reviewsPreview.length > 0 && (
          <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Recent Reviews</p>
            <div className="mt-5 space-y-4">
              {reviewsPreview.map((review) => (
                <div key={review.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < (review.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-100">{review.comment}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
