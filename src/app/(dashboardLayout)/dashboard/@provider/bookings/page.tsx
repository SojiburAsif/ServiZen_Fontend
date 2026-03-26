"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import {
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
  type Booking,
  type BookingsResponse,
  type BookingFilters,
} from "@/services/booking.service";

const statusMeta = {
  PENDING: {
    label: "Pending",
    icon: AlertCircle,
    className:
      "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    className:
      "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300",
  },
  WORKING: {
    label: "Working",
    icon: PlayCircle,
    className:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/15 dark:text-green-300",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300",
  },
} as const;

const paymentMeta = {
  PAID: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  UNPAID: {
    label: "Unpaid",
    className:
      "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300",
  },
} as const;

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

function getAllowedStatusTransitions(currentStatus: Booking["status"]): Booking["status"][] {
  switch (currentStatus) {
    case "PENDING":
      return ["ACCEPTED", "WORKING", "CANCELLED"];
    case "ACCEPTED":
      return ["WORKING", "COMPLETED", "CANCELLED"];
    case "WORKING":
      return ["COMPLETED", "CANCELLED"];
    default:
      return [];
  }
}

function canCancelBooking(booking: Booking) {
  return (
    ["PENDING", "ACCEPTED", "WORKING"].includes(booking.status) &&
    booking.paymentStatus === "UNPAID"
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusChangeConfirm, setStatusChangeConfirm] = useState<{
    bookingId: string;
    newStatus: Booking["status"];
    isOpen: boolean;
  } | null>(null);

  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
  });

  const [searchText, setSearchText] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getProviderBookings(filters);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const visibleBookings = useMemo(() => {
    const list = bookings?.data ?? [];
    const q = searchText.trim().toLowerCase();

    if (!q) return list;

    return list.filter((booking) => {
      const haystack = [
        booking.service?.name,
        booking.client?.name,
        booking.client?.email,
        booking.status,
        booking.paymentStatus,
        booking.city,
        booking.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [bookings?.data, searchText]);

  const stats = useMemo(() => {
    const list = bookings?.data ?? [];
    return {
      total: bookings?.meta?.total ?? list.length,
      pending: list.filter((b) => b.status === "PENDING").length,
      active: list.filter((b) => ["ACCEPTED", "WORKING"].includes(b.status)).length,
      completed: list.filter((b) => b.status === "COMPLETED").length,
      cancelled: list.filter((b) => b.status === "CANCELLED").length,
      unpaid: list.filter((b) => b.paymentStatus === "UNPAID").length,
    };
  }, [bookings]);

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking["status"]) => {
    setStatusChangeConfirm({ bookingId, newStatus, isOpen: true });
  };

  const confirmStatusUpdate = async () => {
    if (!statusChangeConfirm) return;

    const { bookingId, newStatus } = statusChangeConfirm;
    setStatusChangeConfirm(null);

    try {
      setUpdatingBooking(bookingId);
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);

      if (updatedBooking) {
        setBookings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map((booking) =>
              booking.id === bookingId ? updatedBooking : booking,
            ),
          };
        });

        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(updatedBooking);
        }
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setUpdatingBooking(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      setUpdatingBooking(bookingId);
      const success = await cancelBooking(bookingId);

      if (success) {
        setBookings((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status: "CANCELLED" as const }
                : booking,
            ),
          };
        });

        if (selectedBooking?.id === bookingId) {
          setSelectedBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : prev));
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setUpdatingBooking(null);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const meta = statusMeta[status];
    const Icon = meta.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.className}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {meta.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: Booking["paymentStatus"]) => {
    const meta = paymentMeta[paymentStatus];
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${meta.className}`}
      >
        {meta.label}
      </span>
    );
  };

  if (loading && !bookings) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="animate-pulse rounded-[2rem] border border-white/40 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            <div className="h-8 w-64 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-4 w-96 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-3xl border border-white/40 bg-white/60 dark:border-white/10 dark:bg-slate-950/60"
                />
              ))}
            </div>

            <div className="animate-pulse rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
              <div className="h-12 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-full space-y-3">
                      <div className="h-5 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  const meta = bookings?.meta;
  const currentPage = meta?.page ?? 1;
  const currentLimit = meta?.limit ?? 10;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const showingStart = total === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  const showingEnd = Math.min(currentPage * currentLimit, total);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
          {/* Header */}
          <div className="rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-[0_20px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  Provider Booking Console
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  My Bookings
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Review incoming requests, update service progress, manage payment status,
                  and keep your booking workflow organized.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatCard label="Total" value={stats.total} icon={Calendar} />
                <StatCard label="Pending" value={stats.pending} icon={AlertCircle} />
                <StatCard label="Active" value={stats.active} icon={PlayCircle} />
                <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="border border-white/40 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by service, client, city, or status"
                    className="h-12 rounded-2xl border-white/40 bg-white/80 pl-11 text-sm shadow-inner shadow-white/40 placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/20 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                  />
                </div>

                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value === "all" ? undefined : (value as Booking["status"]),
                      page: 1,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-white/40 bg-white/80 text-sm shadow-inner shadow-white/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-white/20 bg-white/95 text-slate-800 shadow-2xl dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="WORKING">Working</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.paymentStatus || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      paymentStatus:
                        value === "all" ? undefined : (value as Booking["paymentStatus"]),
                      page: 1,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-white/40 bg-white/80 text-sm shadow-inner shadow-white/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
                    <SelectValue placeholder="Filter by payment" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-white/20 bg-white/95 text-slate-800 shadow-2xl dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={fetchBookings}
                  disabled={loading}
                  className="h-12 rounded-2xl border-white/50 bg-white/80 px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            {visibleBookings.length === 0 ? (
              <Card className="border border-white/40 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
                <CardContent className="px-6 py-16 text-center sm:px-10">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <Calendar className="h-11 w-11" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    No bookings found
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {searchText || filters.status || filters.paymentStatus
                      ? "Try adjusting your filters or search terms."
                      : "New bookings will appear here automatically."}
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchText("");
                      setFilters({ page: 1, limit: 10 });
                    }}
                    className="mt-6 rounded-2xl border-white/50 bg-white/80 px-5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/80"
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              visibleBookings.map((booking) => {
                const isBusy = updatingBooking === booking.id;

                return (
                  <Card
                    key={booking.id}
                    className="group overflow-hidden border border-white/40 bg-white/75 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/60"
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                <Badge className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300">
                                  Booking #{booking.id.slice(-6).toUpperCase()}
                                </Badge>
                                {booking.paymentStatus === "PAID" ? (
                                  <Badge className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300">
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300">
                                    Unpaid
                                  </Badge>
                                )}
                              </div>

                              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                {booking.service.name}
                              </h3>

                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                                <span className="inline-flex items-center gap-2">
                                  <User className="h-4 w-4 text-emerald-500" />
                                  {booking.client.name}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-emerald-500" />
                                  {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-emerald-500" />
                                  {booking.bookingTime}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentBadge(booking.paymentStatus)}
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/60">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  Service Location
                                </p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                  {booking.address}, {booking.city}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/60">
                              <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  Total Amount
                                </p>
                                <p className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-300">
                                  {formatMoney(booking.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col gap-3 border-t border-white/40 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Booked on{" "}
                              {format(new Date(booking.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBooking(booking)}
                                className="rounded-2xl border-white/50 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Button>

                              {/* Quick Status Actions */}
                              <div className="flex items-center gap-1">
                                {getAllowedStatusTransitions(booking.status).slice(0, 2).map((status) => {
                                  const metaStatus = statusMeta[status];
                                  const StatusIcon = metaStatus.icon;

                                  return (
                                    <Button
                                      key={status}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusUpdate(booking.id, status)}
                                      disabled={isBusy}
                                      className={`rounded-xl border-2 px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 ${
                                        status === "ACCEPTED"
                                          ? "border-sky-500/50 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300"
                                          : status === "WORKING"
                                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                                          : status === "COMPLETED"
                                          ? "border-green-500/50 bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-300"
                                          : "border-amber-500/50 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
                                      }`}
                                      title={`Mark as ${metaStatus.label}`}
                                    >
                                      {isBusy ? (
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <StatusIcon className="h-3.5 w-3.5" />
                                      )}
                                      <span className="ml-1 hidden sm:inline">{metaStatus.label}</span>
                                    </Button>
                                  );
                                })}

                                {/* More Actions Dropdown */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={isBusy}
                                      className="rounded-xl border-white/50 bg-white/80 px-2 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
                                      title="More actions"
                                    >
                                      {isBusy ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <MoreVertical className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56 rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl dark:border-white/10 dark:bg-slate-950"
                                  >
                                    <div className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                      Status Actions
                                    </div>

                                    {getAllowedStatusTransitions(booking.status).map((status) => {
                                      const metaStatus = statusMeta[status];
                                      const StatusIcon = metaStatus.icon;

                                      return (
                                        <DropdownMenuItem
                                          key={status}
                                          onClick={() => handleStatusUpdate(booking.id, status)}
                                          disabled={isBusy}
                                          className="cursor-pointer rounded-xl px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                          <StatusIcon className={`mr-3 h-4 w-4 ${
                                            status === "ACCEPTED" ? "text-sky-500" :
                                            status === "WORKING" ? "text-emerald-500" :
                                            status === "COMPLETED" ? "text-green-500" :
                                            status === "CANCELLED" ? "text-rose-500" :
                                            "text-amber-500"
                                          }`} />
                                          <div className="flex flex-col">
                                            <span className="font-medium">Mark as {metaStatus.label}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                              {status === "ACCEPTED" ? "Accept this booking request" :
                                               status === "WORKING" ? "Start working on this service" :
                                               status === "COMPLETED" ? "Mark service as finished" :
                                               status === "CANCELLED" ? "Cancel this booking" :
                                               "Move to next status"}
                                            </span>
                                          </div>
                                        </DropdownMenuItem>
                                      );
                                    })}

                                    {canCancelBooking(booking) && (
                                      <>
                                        <DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-slate-800" />
                                        <DropdownMenuItem
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={isBusy}
                                          className="cursor-pointer rounded-xl px-3 py-2.5 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                                        >
                                          <XCircle className="mr-3 h-4 w-4" />
                                          <div className="flex flex-col">
                                            <span className="font-medium">Cancel Booking</span>
                                            <span className="text-xs text-rose-500 dark:text-rose-400">
                                              Only possible for unpaid bookings
                                            </span>
                                          </div>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {meta && total > currentLimit && (
            <div className="flex flex-col gap-4 rounded-[2rem] border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Showing {showingStart} to {showingEnd} of {total} bookings
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
                  disabled={currentPage <= 1 || loading}
                  className="rounded-2xl border-white/50 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
                  disabled={currentPage >= totalPages || loading}
                  className="rounded-2xl border-white/50 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/40 bg-white/95 p-0 shadow-2xl dark:border-white/10 dark:bg-slate-950 sm:max-w-4xl">
          <div className="border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                <Calendar className="h-5 w-5 text-emerald-500" />
                Booking Details
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-300">
                Full booking information, status, and service context.
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedBooking && (
            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-3xl border border-white/40 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-emerald-500/20">
                        <AvatarImage src={selectedBooking.provider.profilePhoto} />
                        <AvatarFallback className="rounded-2xl bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-300">
                          {selectedBooking.provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedBooking.service.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Provider: {selectedBooking.provider.name}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Duration: {selectedBooking.service.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                          {formatMoney(selectedBooking.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-white/40 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-emerald-500/20">
                        <AvatarFallback className="rounded-2xl bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-300">
                          {selectedBooking.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedBooking.client.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="h-3.5 w-3.5 text-emerald-500" />
                          {selectedBooking.client.email}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-3xl border border-white/40 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {format(new Date(selectedBooking.bookingDate), "EEEE, MMMM dd, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {selectedBooking.bookingTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
                    <MapPin className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Service Location
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {selectedBooking.address}, {selectedBooking.city}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Lat: {selectedBooking.latitude}, Lng: {selectedBooking.longitude}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200/70 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(selectedBooking.status)}
                      {getPaymentBadge(selectedBooking.paymentStatus)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Booked on{" "}
                      {format(new Date(selectedBooking.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={statusChangeConfirm?.isOpen || false}
        onOpenChange={(open) => {
          if (!open) setStatusChangeConfirm(null);
        }}
      >
        <AlertDialogContent className="backdrop-blur-md bg-white/95 border border-white/40 shadow-2xl dark:border-white/10 dark:bg-slate-950">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Status Change
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
              Are you sure you want to change the booking status to{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {statusChangeConfirm?.newStatus}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/80 hover:bg-white border-white/50 text-slate-700 dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
