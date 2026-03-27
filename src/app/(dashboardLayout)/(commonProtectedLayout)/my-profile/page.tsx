/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "@/services/auth.service";
import { getLoggedInUserProfile } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, ShieldCheck, Star, User, CalendarDays, BadgeCheck, Edit } from "lucide-react";
import { ProfileUpdateForm } from "@/components/features/ProfileUpdateForm";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, profileData] = await Promise.all([
          getUserInfo(),
          getLoggedInUserProfile()
        ]);
        setUser(userData);
        setProfile(profileData);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen w-full bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-12 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white">
        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user || !profile) {
    return (
      <main className="relative min-h-screen w-full bg-gradient-to-br from-[#F5FFF3] via-white to-[#DFF9E2] px-4 py-12 text-gray-900 dark:from-[#010F08] dark:via-[#041F0E] dark:to-[#03200F] dark:text-white">
        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Profile</h1>
              <p className="text-gray-600 dark:text-gray-300">{error || "Unable to load profile information"}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const client = profile?.client;
  const provider = profile?.provider;
  const reviews = [...(client?.reviews ?? provider?.reviews ?? [])].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  const membershipDate = formatDate(profile?.createdAt);
  const phone = provider?.contactNumber ?? client?.contactNumber ?? "Not provided";
  const address = provider?.address ?? client?.address ?? "Address not set";
  const city = provider?.city ?? client?.city;
  const primaryEmail = profile?.email || user?.email || "No email";
  const accountRole = (profile?.role || user?.role || "USER").toUpperCase();
  const isProvider = accountRole === "PROVIDER";
  const isClient = accountRole === "USER";
  const profileType = isProvider ? "Provider" : "Client";
  const isVerified = Boolean(profile?.emailVerified || user?.emailVerified);
  const reviewsPreview = reviews.slice(0, 2);
  const handleProfileUpdateSuccess = async () => {
    // Refresh the profile data after successful update
    try {
      const [userData, profileData] = await Promise.all([
        getUserInfo(),
        getLoggedInUserProfile()
      ]);
      setUser(userData);
      setProfile(profileData);
    } catch (err) {
      console.error("Error refreshing profile data:", err);
    }
  };

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
              <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 dark:text-emerald-300">{profileType} Profile</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {profile?.name || user?.name || "Guest"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">Member since {membershipDate}</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="size-10" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">Account Status</p>
                <p className="text-lg font-black">{profile?.status || "ACTIVE"}</p>
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
                <dt className="text-slate-500">Email Verified</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  {isVerified ? <BadgeCheck className="size-4 text-emerald-500" /> : <ShieldCheck className="size-4 text-amber-500" />}
                  {isVerified ? "Yes" : "Pending"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Member Since</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{membershipDate}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Account Role</dt>
                <dd className="font-semibold">{accountRole}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd>
                  <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90">Verified User</Badge>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Identity</p>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Full Name</p>
                  <p className="text-lg font-black">{user?.name || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Email Address</p>
                  <p className="text-lg font-black">{primaryEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Account Role</p>
                  <p className="text-lg font-black">{accountRole}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Recent Reviews</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {isProvider ? "Reviews received from clients" : "Reviews you have shared"}
                </p>
              </div>
              <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-200">
                {reviews.length} entries
              </Badge>
            </div>
            {reviews.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-300">
                {isProvider ? "No reviews received yet." : "You have not shared any reviews yet."}
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {reviewsPreview.map((review: any) => (
                  <div key={review.id} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={`${review.id}-${idx}`} className={`size-4 ${idx < (review.rating ?? 0) ? "fill-current" : "opacity-30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Provider Services Section - Only show for providers */}
        {isProvider && provider?.services && provider.services.length > 0 && (
          <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">My Services</p>
              <Badge variant="secondary" className="rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                {provider.services.length} services
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {provider.services.map((service: any) => (
                <div key={service.id} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ${service.price}
                    </Badge>
                    <Badge variant={service.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Client Bookings Section - Only show for clients */}
        {isClient && client?.bookings && client.bookings.length > 0 && (
          <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">My Bookings</p>
              <Badge variant="secondary" className="rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                {client.bookings.length} bookings
              </Badge>
            </div>
            <div className="space-y-3">
              {client.bookings.slice(0, 3).map((booking: any) => (
                <div key={booking.id} className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Booking #{booking.id.slice(-8)}</h3>
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"} className="text-xs">
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(booking.bookingDate)} at {booking.bookingTime}
                  </p>
                  {booking.totalAmount && (
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Total: ${booking.totalAmount}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profile Update Section */}
        <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
              <Edit className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Update Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Keep your profile information up to date</p>
            </div>
          </div>

          <ProfileUpdateForm
            initialData={{
              name: profile?.name || user?.name,
              email: profile?.email || user?.email,
              contactNumber: (provider?.contactNumber ?? client?.contactNumber) || undefined,
              address: (provider?.address ?? client?.address) || undefined,
              image: profile?.image || undefined,
            }}
            onSuccess={handleProfileUpdateSuccess}
          />
        </section>
      </div>
    </main>
  );
}