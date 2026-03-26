"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Loader2, MapPin, Search, Sparkles, Star, TrendingUp } from "lucide-react";

import { getAllServices, type ServiceRecord } from "@/services/services.service";
import type { PaginationMeta } from "@/types/api.types";
import { ServicesValidation } from "@/zod/services.validation";
import { extractApiErrorMessage } from "@/lib/httpError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SpecialtyOption } from "./services-manager";

type PriceSortOption = "recent" | "asc" | "desc";

const formatCurrency = (value?: number | null) =>
  Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value ?? 0);

export type PublicServicesGridProps = {
  initialServices: ServiceRecord[];
  initialMeta?: PaginationMeta | null;
  specialties: SpecialtyOption[];
};

export const PublicServicesGrid = ({ initialServices, initialMeta, specialties }: PublicServicesGridProps) => {
  const [services, setServices] = useState<ServiceRecord[]>(initialServices);
  const [meta, setMeta] = useState<PaginationMeta | null | undefined>(initialMeta);
  const [page, setPage] = useState(initialMeta?.page ?? 1);
  const [specialtyId, setSpecialtyId] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState<PriceSortOption>("recent");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = meta?.limit ?? initialMeta?.limit ?? 12;
  const safeServices = Array.isArray(services) ? services : [];
  const safeServiceCount = safeServices.length;

  const hasMore = useMemo(() => {
    if (!meta?.total) return safeServiceCount >= limit;
    return safeServiceCount < meta.total;
  }, [meta, safeServiceCount, limit]);

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return safeServices.filter((service) => {
      if (!term) return true;
      const haystacks = [
        service.name,
        service.description ?? "",
        service.specialty?.title ?? "",
        service.provider?.name ?? "",
        service.provider?.contactNumber ?? "",
      ].map((value) => value.toLowerCase());
      return haystacks.some((value) => value.includes(term));
    });
  }, [safeServices, searchTerm]);

  const fetchServices = async ({
    append,
    pageOverride,
    specialtyOverride,
    minPriceOverride,
    maxPriceOverride,
    searchOverride,
    priceSortOverride,
  }: {
    append: boolean;
    pageOverride?: number;
    specialtyOverride?: string;
    minPriceOverride?: string;
    maxPriceOverride?: string;
    searchOverride?: string;
    priceSortOverride?: PriceSortOption;
  }) => {
    const nextPage = pageOverride ?? (append ? page + 1 : 1);
    const effectiveSpecialty = specialtyOverride ?? specialtyId;
    const effectiveMin = minPriceOverride ?? priceMin;
    const effectiveMax = maxPriceOverride ?? priceMax;
    const effectiveSearch = searchOverride ?? searchTerm;
    const effectivePriceSort = priceSortOverride ?? priceSort;
    const selectedSpecialtyId = effectiveSpecialty !== "all" ? effectiveSpecialty : undefined;
    const selectedCategory = selectedSpecialtyId
      ? specialties.find((sp) => sp.id === selectedSpecialtyId)?.title
      : undefined;

    const parsed = ServicesValidation.serviceFiltersSchema.safeParse({
      page: nextPage,
      limit,
      specialtyId: selectedSpecialtyId,
      minPrice: effectiveMin ? Number(effectiveMin) : undefined,
      maxPrice: effectiveMax ? Number(effectiveMax) : undefined,
      searchTerm: effectiveSearch.trim() ? effectiveSearch.trim() : undefined,
      category: selectedCategory,
      priceSort: effectivePriceSort === "recent" ? undefined : effectivePriceSort,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid filters");
      append ? setLoadingMore(false) : setLoading(false);
      return;
    }

    append ? setLoadingMore(true) : setLoading(true);
    try {
      const response = await getAllServices(parsed.data);
      setMeta(response.meta ?? null);
      setPage(parsed.data.page ?? nextPage);
      setServices((prev) => {
        const previousList = Array.isArray(prev) ? prev : [];
        const nextData = Array.isArray(response.data) ? response.data : [];
        return append ? [...previousList, ...nextData] : nextData;
      });
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Unable to fetch services"));
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  const applyFilters = () => {
    void fetchServices({ append: false, pageOverride: 1 });
  };

  const resetFilters = () => {
    setSpecialtyId("all");
    setPriceMin("");
    setPriceMax("");
    setSearchTerm("");
    setPriceSort("recent");
    void fetchServices({
      append: false,
      pageOverride: 1,
      specialtyOverride: "all",
      minPriceOverride: "",
      maxPriceOverride: "",
      searchOverride: "",
      priceSortOverride: "recent",
    });
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-8 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">ServiZen marketplace</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight">Browse vetted home & wellness experts</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Every service here is verified by our ops team. Filter by specialty or price, and check transparent stats
              before booking.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-sm font-medium">
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">Available today</p>
            <p className="text-2xl font-semibold">{safeServiceCount} listings</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Search</label>
            <div className="mt-2 relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Try “Deep cleaning” or “AC tune-up”"
                className="pl-10"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Specialty</label>
            <Select
              value={specialtyId}
              onValueChange={(value) => {
                setSpecialtyId(value);
                void fetchServices({ append: false, pageOverride: 1, specialtyOverride: value });
              }}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Budget</label>
            <div className="mt-2 flex gap-3">
              <Input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Price order</label>
            <Select
              value={priceSort}
              onValueChange={(value) => {
                const nextValue = value as PriceSortOption;
                setPriceSort(nextValue);
                void fetchServices({ append: false, pageOverride: 1, priceSortOverride: nextValue });
              }}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Newest first</SelectItem>
                <SelectItem value="asc">Price: Low to high</SelectItem>
                <SelectItem value="desc">Price: High to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" className="gap-2" onClick={applyFilters}>
            <Sparkles className="h-4 w-4" /> Apply filters
          </Button>
          <Button type="button" variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white/80 p-8 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading services...
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => {
          if (!service.id) return null;
          return (
            <Card
              key={service.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {service.specialty?.title ?? "General"}
                  </Badge>
                  <p className="text-xs text-slate-400">Updated {new Date(service.updatedAt ?? service.createdAt ?? Date.now()).toLocaleDateString()}</p>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{service.name}</CardTitle>
                <p className="text-sm text-slate-500 line-clamp-3">{service.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(service.price)}</p>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">per session</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <p className="font-semibold">{service.provider?.name ?? "ServiZen Provider"}</p>
                      <p className="text-xs text-slate-500">{service.provider?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400" />
                      {service.provider?.averageRating ?? "New"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {service.provider?.contactNumber ?? "Available nationwide"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> {service.totalPaidBookings ?? 0} paid bookings
                  </span>
                  <span>{formatCurrency(service.totalPaidAmount)} earned</span>
                </div>
                <Button className="w-full" variant={service.isActive ? "default" : "secondary"} disabled={!service.isActive} asChild>
                  <Link href={`/services/${service.id}`}>
                    {service.isActive ? "View details" : "Paused by provider"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && !loading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No services match your filters yet. Try adjusting the specialty or budget range.
        </div>
      ) : null}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button onClick={() => fetchServices({ append: true })} disabled={loadingMore} className="min-w-[200px] gap-2">
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {loadingMore ? "Loading" : "Load more"}
          </Button>
        </div>
      )}
    </section>
  );
};
