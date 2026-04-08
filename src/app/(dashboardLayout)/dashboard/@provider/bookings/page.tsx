"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
  Hash,
  Activity,
  CreditCard,
  History,
  Navigation,
  X,
  Smartphone,
  Info,
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    color: "amber",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "sky",
  },
  WORKING: {
    label: "Working",
    icon: PlayCircle,
    color: "emerald",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    color: "green",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "rose",
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
    <div className="group rounded-[2rem] border border-zinc-100 bg-white p-6 transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {label}
          </p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:bg-zinc-900 dark:text-zinc-400">
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
    
    const colorMap: Record<string, string> = {
      amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
      sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
      emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
      green: "bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20",
      rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ring-1 ${colorMap[meta.color] || ""}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {meta.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: Booking["paymentStatus"]) => {
    return paymentStatus === "PAID" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
        Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400">
        Unpaid
      </span>
    );
  };

  if (loading && !bookings) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="h-44 animate-pulse rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10">
          
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 sm:p-12">
            <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-zinc-100 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Management Portal
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                    Service Bookings
                  </h1>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400">
                    Oversee your business operations, track service milestones, and manage customer relations from one dashboard.
                  </p>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4 sm:w-auto md:grid-cols-4 lg:grid-cols-1 xl:grid-cols-2">
                <StatCard label="Total" value={stats.total} icon={Calendar} />
                <StatCard label="Pending" value={stats.pending} icon={AlertCircle} />
                <StatCard label="In Progress" value={stats.active} icon={PlayCircle} />
                <StatCard label="Success" value={stats.completed} icon={CheckCircle2} />
              </div>
            </div>
            
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-3xl" />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search bookings..."
                className="h-14 rounded-2xl border-zinc-100 bg-white pl-12 shadow-sm transition-all focus-visible:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
                <SelectTrigger className="h-14 w-[160px] rounded-2xl border-zinc-100 bg-white px-5 font-medium dark:border-zinc-800 dark:bg-zinc-950">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="WORKING">Working</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={fetchBookings}
                disabled={loading}
                className="h-14 rounded-2xl border-zinc-100 bg-white px-6 font-bold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Sync
              </Button>
            </div>
          </div>

          {/* Booking Cards Grid */}
          <div className="space-y-6">
            {visibleBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-100 bg-zinc-50/30 py-24 dark:border-zinc-800/50 dark:bg-zinc-950/30">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl dark:bg-zinc-900">
                  <Search className="h-8 w-8 text-zinc-300" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">No Bookings Found</h3>
                <p className="mt-2 text-zinc-500">We couldn`t find any results matching your filters.</p>
              </div>
            ) : (
              visibleBookings.map((booking) => {
                const isBusy = updatingBooking === booking.id;

                return (
                  <Card
                    key={booking.id}
                    className="group border border-zinc-100 bg-white transition-all hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-zinc-500/5 dark:border-zinc-800 dark:bg-zinc-950"
                    style={{ borderRadius: "2.5rem" }}
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                        {/* Service Content Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="rounded-lg border-zinc-100 bg-zinc-50 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                              ID: #{booking.id.slice(-6).toUpperCase()}
                            </Badge>
                            {getStatusBadge(booking.status)}
                            {getPaymentBadge(booking.paymentStatus)}
                          </div>

                          <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                            {booking.service.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-emerald-500" />
                              {booking.client.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-emerald-500" />
                              {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-emerald-500" />
                              {booking.bookingTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-emerald-500" />
                              {booking.city}
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Actions Section */}
                        <div className="flex flex-col items-start gap-4 lg:items-end lg:w-[280px]">
                          <div className="flex w-full items-center justify-between lg:justify-end lg:gap-6">
                            <div className="text-left lg:text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Yield</p>
                              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatMoney(booking.totalAmount)}</p>
                            </div>
                            <Button
                              onClick={() => setSelectedBooking(booking)}
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl border-zinc-100 dark:border-zinc-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex w-full flex-col gap-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Quick Action</p>
                            <div className="grid grid-cols-2 gap-2">
                              {getAllowedStatusTransitions(booking.status).slice(0, 2).map((status) => {
                                const metaStatus = statusMeta[status];
                                const StatusIcon = metaStatus.icon;
                                return (
                                  <Button
                                    key={status}
                                    onClick={() => handleStatusUpdate(booking.id, status)}
                                    disabled={isBusy}
                                    variant="outline"
                                    className="h-10 rounded-xl border-zinc-100 bg-white px-3 text-[10px] font-bold uppercase tracking-tight hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-emerald-500/10 sm:text-[11px]"
                                  >
                                    <StatusIcon className="mr-2 h-3 w-3" />
                                    {metaStatus.label}
                                  </Button>
                                );
                              })}
                              {getAllowedStatusTransitions(booking.status).length > 2 && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="h-10 rounded-xl border-zinc-100 bg-white px-3 text-[11px] font-bold uppercase dark:border-zinc-800 dark:bg-zinc-950"
                                    >
                                      More...
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border-zinc-100 p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                                    {getAllowedStatusTransitions(booking.status).slice(2).map((status) => {
                                       const metaStatus = statusMeta[status];
                                       return (
                                         <DropdownMenuItem
                                           key={status}
                                           onClick={() => handleStatusUpdate(booking.id, status)}
                                           className="rounded-xl font-bold text-xs"
                                         >
                                           Mark as {metaStatus.label}
                                         </DropdownMenuItem>
                                       );
                                    })}
                                    {canCancelBooking(booking) && (
                                      <DropdownMenuItem
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="rounded-xl font-bold text-xs text-rose-500"
                                      >
                                        Cancel Booking
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {getAllowedStatusTransitions(booking.status).length <= 2 && canCancelBooking(booking) && (
                                <Button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  variant="ghost"
                                  className="h-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
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

          {/* Pagination Controls */}
          {meta && total > currentLimit && (
            <div className="flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 lg:flex-row">
              <p className="text-sm font-bold text-zinc-400">
                Displaying <span className="text-zinc-900 dark:text-white">{showingStart}-{showingEnd}</span> of <span className="text-zinc-900 dark:text-white">{total}</span>
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
                  disabled={currentPage <= 1 || loading}
                  className="h-12 rounded-xl border-zinc-100 px-4 font-bold dark:border-zinc-800"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>

                <div className="flex items-center gap-2">
                   {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                      className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${
                        currentPage === i + 1 
                        ? "bg-zinc-900 text-white shadow-xl dark:bg-white dark:text-black" 
                        : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {i + 1}
                    </button>
                   ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
                  disabled={currentPage >= totalPages || loading}
                  className="h-12 rounded-xl border-zinc-100 px-4 font-bold dark:border-zinc-800"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimized Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedBooking(null)}
          />
          
          <div className="relative z-10 flex h-full max-h-[700px] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl animate-in zoom-in-95 duration-300 dark:bg-zinc-950" 
            style={{ borderRadius: "2rem" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-8 py-5 dark:border-zinc-800">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                     <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Booking Management</h3>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">ID: {selectedBooking.id.slice(-10).toUpperCase()}</p>
                  </div>
               </div>
               <button 
                onClick={() => setSelectedBooking(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 transition-all hover:bg-rose-50 hover:text-rose-500 dark:bg-zinc-900"
               >
                 <X className="h-5 w-5" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 gap-8">
                
                {/* 1. Service Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Service Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900/50">
                      <h5 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                        {selectedBooking.service.name}
                      </h5>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">Duration</p>
                          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{selectedBooking.service.duration}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Fee</p>
                          <p className="text-sm font-bold text-emerald-600">{formatMoney(selectedBooking.totalAmount)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 p-5 dark:border-zinc-800">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 text-zinc-400" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">Location Target</p>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {selectedBooking.address}, {selectedBooking.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Consumer Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <User className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Consumer Identity</h4>
                  </div>
                  
                  <div className="flex items-center gap-6 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800">
                    <div className="h-14 w-14 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl uppercase">
                        {selectedBooking.client.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-bold text-zinc-900 dark:text-white">{selectedBooking.client.name}</h5>
                      <p className="text-sm font-medium text-zinc-500">{selectedBooking.client.email}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Account
                    </div>
                  </div>
                </div>

                {/* 3. Booking Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                     <Calendar className="h-4 w-4 text-emerald-500" />
                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Booking Schedule</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-zinc-100 p-4 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span className="text-xs font-semibold">{format(new Date(selectedBooking.bookingDate), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-3 border-l border-zinc-100 pl-3 dark:border-zinc-800">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span className="text-xs font-semibold">{selectedBooking.bookingTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                       <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Status:</span>
                       {getStatusBadge(selectedBooking.status)}
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                       <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Payment:</span>
                       {getPaymentBadge(selectedBooking.paymentStatus)}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50 px-8 py-5 dark:border-zinc-800 dark:bg-zinc-950/20">
               <Button 
                variant="outline" 
                onClick={() => setSelectedBooking(null)}
                className="h-10 rounded-xl font-bold text-xs"
               >
                 Close View
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <AlertDialog
        open={statusChangeConfirm?.isOpen || false}
        onOpenChange={(open) => !open && setStatusChangeConfirm(null)}
      >
        <AlertDialogContent className="max-w-md rounded-[3rem] border-none bg-white p-10 shadow-2xl dark:bg-zinc-950">
          <AlertDialogHeader className="hidden">
             <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-amber-50 text-amber-500 dark:bg-amber-500/10">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Sync Status?</h3>
            <p className="mt-4 text-lg text-zinc-500 font-medium leading-relaxed">
              Transitioning to <span className="font-black text-zinc-900 dark:text-white uppercase tracking-wider">{statusChangeConfirm?.newStatus}</span>. This protocol notifies the consumer immediately.
            </p>
          </div>
          <AlertDialogFooter className="mt-10 flex gap-4 sm:flex-row flex-col">
            <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-zinc-100 bg-white text-lg font-bold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              className="h-14 flex-1 rounded-2xl bg-zinc-900 text-lg font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
