import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, LayoutGrid, MapPin, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { getAllServices, getServiceById, type ServiceRecord } from "@/services/services.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceDetailsPageProps = {
	params: {
		id: string;
	};
};

const formatCurrency = (value?: number | null) =>
	Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value ?? 0);

const formatDate = (value?: string) => {
	if (!value) return "Recently updated";
	return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
	const serviceId = params?.id;

	if (!serviceId || serviceId === "undefined") {
		notFound();
	}

	let service: ServiceRecord | null = null;
	try {
		const response = await getServiceById(serviceId);
		service = response.data ?? null;
	} catch (error) {
		console.error("Failed to fetch service details", error);
	}

	if (!service) {
		notFound();
	}

	let related: ServiceRecord[] = [];
	if (service.providerId) {
		try {
			const relatedResponse = await getAllServices({ providerId: service.providerId, limit: 4 });
			related = (relatedResponse.data ?? []).filter((item) => item.id !== service?.id);
		} catch (error) {
			console.error("Failed to fetch related services", error);
		}
	}

	return (
		<div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-0">
			<div className="flex items-center gap-3 text-sm text-slate-500">
				<Link href="/services" className="text-emerald-600 underline">
					Marketplace
				</Link>
				<span>/</span>
				<span>{service.name}</span>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
				<section className="space-y-6">
					<div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
						<div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
							<span>ServiZen Service</span>
							{service.isActive ? (
								<span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold">
									<Sparkles className="h-3 w-3" /> Live now
								</span>
							) : (
								<span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold">
									<ShieldCheck className="h-3 w-3" /> Paused
								</span>
							)}
						</div>
						<div className="mt-6 flex flex-wrap items-center gap-4">
							{service.specialty?.title ? (
								<Badge className="bg-emerald-200/20 text-emerald-200">{service.specialty.title}</Badge>
							) : null}
							<p className="text-sm text-white/70">Updated {formatDate(service.updatedAt ?? service.createdAt ?? undefined)}</p>
						</div>
						<h1 className="mt-6 text-4xl font-black leading-tight">{service.name}</h1>
						<p className="mt-4 max-w-3xl text-base text-white/80">{service.description}</p>
						<div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/80">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-white/60">Starting at</p>
								<p className="text-4xl font-black">{formatCurrency(service.price)}</p>
							</div>
							{service.duration && (
								<div>
									<p className="text-xs uppercase tracking-[0.3em] text-white/60">Typical duration</p>
									<p className="text-lg font-semibold">{service.duration}</p>
								</div>
							)}
						</div>
						{service.imageUrl ? (
							<div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
								<img src={service.imageUrl} alt={`${service.name} cover`} className="h-64 w-full object-cover" />
							</div>
						) : null}
					</div>

					<Card className="rounded-3xl border-slate-100 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
						<CardHeader>
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Service details</p>
							<CardTitle className="text-2xl">What’s included</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
							<div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
								<LayoutGrid className="h-4 w-4" />
								<span>Category: {service.specialty?.title ?? "General"}</span>
							</div>
							<div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
								<CalendarClock className="h-4 w-4" />
								<span>Created {formatDate(service.createdAt)}</span>
							</div>
							<div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
								<TrendingUp className="h-4 w-4" />
								<span>{service.totalPaidBookings ?? 0} paid bookings · {formatCurrency(service.totalPaidAmount)}</span>
							</div>
						</CardContent>
					</Card>
				</section>

				<aside className="space-y-6">
					<Card className="rounded-3xl border-slate-100 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
						<CardHeader>
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Provider</p>
							<CardTitle className="text-2xl">{service.provider?.name ?? "ServiZen Provider"}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
							<div className="flex items-center gap-3">
								<MapPin className="h-4 w-4" />
								<div>
									<p>Contact</p>
									<p className="text-xs text-slate-500">{service.provider?.contactNumber ?? "Available nationwide"}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<ShieldCheck className="h-4 w-4 text-emerald-500" />
								<div>
									<p>Verified by ServiZen</p>
									<p className="text-xs text-slate-500">Avg. rating {service.provider?.averageRating ?? "New"}</p>
								</div>
							</div>
							<Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700" disabled={!service.isActive}>
								{service.isActive ? "Request booking" : "Temporarily unavailable"}
							</Button>
						</CardContent>
					</Card>

					<Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
						<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Need something else?</p>
						<p className="mt-2 text-xl font-semibold">Explore the marketplace</p>
						<p className="mt-3 text-slate-500">Browse hundreds of vetted services across home, wellness, and professional care.</p>
						<Button variant="outline" asChild className="mt-4 w-full">
							<Link href="/services">Back to services</Link>
						</Button>
					</Card>
				</aside>
			</div>

			{related.length > 0 && (
				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold">More from this provider</h2>
						<Link href="/services" className="text-sm text-emerald-600">
							Browse marketplace
						</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{related.map((relatedService) => (
							<Card key={relatedService.id} className="rounded-3xl border border-slate-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70">
								<CardHeader>
									<div className="flex items-center justify-between">
										<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
											{relatedService.specialty?.title ?? "General"}
										</Badge>
										<span className="text-xs text-slate-400">{formatDate(relatedService.updatedAt ?? relatedService.createdAt)}</span>
									</div>
									<CardTitle className="text-xl">{relatedService.name}</CardTitle>
									<p className="text-sm text-slate-500 line-clamp-2">{relatedService.description}</p>
								</CardHeader>
								<CardContent className="flex items-center justify-between">
									<div>
										<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Starting at</p>
										<p className="text-2xl font-bold">{formatCurrency(relatedService.price)}</p>
									</div>
									<Button asChild variant="ghost" className="text-emerald-600">
										<Link href={`/services/${relatedService.id}`}>View</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}
		</div>
	);
}