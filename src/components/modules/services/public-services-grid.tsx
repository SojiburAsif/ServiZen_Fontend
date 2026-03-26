"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Search,
  Sparkles,
  Star,
  Tag,
  UserRound,
} from "lucide-react";

import type { ServiceRecord } from "@/services/services.service";

type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type SpecialtyOption = {
  id: string;
  title: string;
};

type PublicServicesGridProps = {
  initialServices: ServiceRecord[];
  initialMeta?: PaginationMeta | null;
  specialties?: SpecialtyOption[];
};

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const PublicServicesGrid = ({
  initialServices,
  initialMeta,
  specialties = [],
}: PublicServicesGridProps) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [sortOption, setSortOption] = useState<
    "recommended" | "price-low" | "price-high" | "name-asc"
  >("recommended");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = [...initialServices];

    if (normalizedQuery) {
      list = list.filter((service) => {
        const target = `${service.name ?? ""} ${service.description ?? ""} ${service.specialty?.title ?? ""}`.toLowerCase();
        return target.includes(normalizedQuery);
      });
    }

    if (selectedCategory !== "all") {
      list = list.filter((service) => service.specialty?.id === selectedCategory);
    }

    if (statusFilter !== "all") {
      list = list.filter((service) =>
        statusFilter === "active" ? service.isActive : !service.isActive,
      );
    }

    switch (sortOption) {
      case "price-low":
        list = list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        list = list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        list = list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      default:
        list = list.sort((a, b) => Number(b.isActive) - Number(a.isActive));
        break;
    }

    return list;
  }, [initialServices, query, selectedCategory, statusFilter, sortOption]);

  const totalServices = initialMeta?.total ?? initialServices.length;
  const totalCount = filteredServices.length;
  const activeCount = filteredServices.filter((s) => s.isActive).length;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-transparent p-4 shadow-[0_25px_120px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-transparent sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />

      <div className="relative mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-700 dark:border-green-400/30 dark:bg-green-500/20 dark:text-green-300">
            <Sparkles className="h-4 w-4" />
            Premium services collection
          </div>

          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Our Services
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-slate-300 sm:text-base">
            Explore trusted professionals, verified service providers, and
            quick booking-ready offers made for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
          <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
            <div className="mb-1 flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xl font-black">{totalCount}</span>
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
              Total
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
            <div className="mb-1 flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
              <BadgeCheck className="h-4 w-4" />
              <span className="text-xl font-black">{activeCount}</span>
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
              Active
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
            <div className="mb-1 flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
              <Tag className="h-4 w-4" />
              <span className="text-xl font-black">{specialties.length}</span>
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
              Categories
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.5fr_0.5fr_0.5fr]">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
            Search
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600 dark:text-green-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, specialty, or keyword"
              className="h-14 rounded-2xl border-white/40 bg-white/60 pl-11 text-sm shadow-inner shadow-white/40 placeholder:text-gray-500 focus-visible:border-green-400 focus-visible:ring-green-400/20 dark:border-white/10 dark:bg-black/40 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
            Category
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-14 rounded-2xl border-white/40 bg-white/60 text-sm text-gray-700 shadow-inner shadow-white/40 focus:ring-green-400/20 dark:border-white/10 dark:bg-black/40 dark:text-white">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-white/20 bg-white/90 text-gray-700 shadow-2xl dark:border-white/10 dark:bg-black/80 dark:text-slate-100">
              <SelectItem value="all">All categories</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
            Status
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="h-14 rounded-2xl border-white/40 bg-white/60 text-sm text-gray-700 shadow-inner shadow-white/40 focus:ring-green-400/20 dark:border-white/10 dark:bg-black/40 dark:text-white">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-white/20 bg-white/90 text-gray-700 shadow-2xl dark:border-white/10 dark:bg-black/80 dark:text-slate-100">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Available now</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
            Sort by
          </div>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as typeof sortOption)}>
            <SelectTrigger className="h-14 rounded-2xl border-white/40 bg-white/60 text-sm text-gray-700 shadow-inner shadow-white/40 focus:ring-green-400/20 dark:border-white/10 dark:bg-black/40 dark:text-white">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-white/20 bg-white/90 text-gray-700 shadow-2xl dark:border-white/10 dark:bg-black/80 dark:text-slate-100">
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {specialties.length > 0 && (
        <div className="relative mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 dark:border-green-400/30 dark:bg-green-500/20 dark:text-green-300">
            Browse by focus
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 ${
                selectedCategory === "all"
                  ? "border-gray-900 bg-gray-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-gray-950"
                  : "border-white/40 bg-white/50 text-gray-600 backdrop-blur hover:border-green-300 hover:text-green-600 dark:border-white/10 dark:bg-black/40 dark:text-slate-300"
              }`}
            >
              All
            </button>
            {specialties.slice(0, 10).map((specialty) => (
              <button
                key={specialty.id}
                type="button"
                onClick={() => setSelectedCategory(specialty.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 ${
                  selectedCategory === specialty.id
                    ? "border-green-500 bg-green-500 text-white shadow-lg"
                    : "border-white/40 bg-white/50 text-gray-600 backdrop-blur hover:border-green-300 hover:text-green-600 dark:border-white/10 dark:bg-black/40 dark:text-slate-300"
                }`}
              >
                {specialty.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.id}`}
            className="group relative overflow-hidden rounded-[1.5rem] border border-white/50 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-slate-900/80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-slate-800">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-600 to-lime-500 text-white">
                  <div className="text-center">
                    <Sparkles className="mx-auto mb-2 h-6 w-6 animate-pulse" />
                    <p className="text-xs font-semibold">No Preview</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute left-3 top-3">
                <Badge className="rounded-full border-0 bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow-lg backdrop-blur dark:bg-black/90 dark:text-white">
                  {service.specialty?.title || "General"}
                </Badge>
              </div>

              <div className="absolute right-3 top-3">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-lg backdrop-blur ${
                    service.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {service.isActive ? "Active" : "Paused"}
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium backdrop-blur">
                  <UserRound className="h-3 w-3" />
                  Verified
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium backdrop-blur">
                  <Clock3 className="h-3 w-3" />
                  Fast
                </div>
              </div>
            </div>

            <div className="relative p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 flex-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white">
                  {service.name}
                </h3>
                <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(service.price)}
                </span>
              </div>

              <p className="line-clamp-2 text-sm leading-5 text-gray-600 dark:text-slate-300 mb-3">
                {service.description ||
                  "Professional service with reliable support and easy booking."}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  View details
                </div>

                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-12">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="relative rounded-[1.5rem] border border-dashed border-gray-300 bg-white/60 px-6 py-20 text-center text-gray-500 dark:border-white/10 dark:bg-black/40 dark:text-slate-300">
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-green-500 animate-pulse" />
          <p className="text-lg font-semibold text-gray-700 dark:text-white">
            No services available right now.
          </p>
          <p className="mt-2 text-sm">
            Please check back later or explore other categories for more options.
          </p>
        </div>
      )}

      {initialMeta?.total ? (
        <div className="relative mt-8 flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/20 px-5 py-4 text-sm text-gray-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-slate-300 lg:flex-row lg:items-center lg:justify-between">
          <span>Showing {totalCount} refined result{totalCount === 1 ? "" : "s"}</span>
          <span>Total catalogue: {totalServices}</span>
          <span>Page {initialMeta.page ?? 1}</span>
        </div>
      ) : (
        <div className="relative mt-8 rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-sm text-gray-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 dark:text-slate-300">
          Showing {totalCount} curated service{totalCount === 1 ? "" : "s"}
        </div>
      )}
    </section>
  );
};
