"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminBooking,
  BookingFilters,
  BookingStatus,
  PaymentStatus,
  cancelBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from "@/services/admin-booking.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const bookingStatusColors: Record<BookingStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  ACCEPTED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  WORKING:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
  COMPLETED:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300",
  CANCELLED:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  UNPAID:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  PAID:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300",
  REFUNDED:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300",
};

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "WORKING", label: "Working" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const paymentOptions: { value: PaymentStatus; label: string }[] = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "REFUNDED", label: "Refunded" },
];

const formatMoney = (value?: number | null) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString?: string) => timeString || "-";

const serviceLabel = (service?: { name?: string; title?: string }) =>
  service?.title || service?.name || "-";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card className="overflow-hidden border border-black/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-black/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-black dark:text-white">
              {value}
            </p>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-3 dark:border-green-500/20 dark:bg-green-500/10">
            <Icon className="h-6 w-6 text-green-700 dark:text-green-300" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black/30">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium text-black dark:text-white">{value}</div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [detailedBooking, setDetailedBooking] = useState<AdminBooking | null>(null);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [providerFilter, setProviderFilter] = useState<string>("");

  const [updateForm, setUpdateForm] = useState<{
    status: BookingStatus | "";
    paymentStatus: PaymentStatus | "";
  }>({
    status: "",
    paymentStatus: "",
  });

  const fetchBookings = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);

        const filters: BookingFilters = {
          page,
          limit: 10,
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(paymentStatusFilter ? { paymentStatus: paymentStatusFilter } : {}),
          ...(clientFilter ? { clientId: clientFilter } : {}),
          ...(providerFilter ? { providerId: providerFilter } : {}),
        };

        const response = await getAllBookings(filters);

        if (response.success) {
          setBookings(response.data.data);
          setMeta({
            page: response.data.meta.page,
            totalPages: Math.max(1, Math.ceil(response.data.meta.total / response.data.meta.limit)),
            total: response.data.meta.total,
          });
        } else {
          toast.error(response.message || "Failed to fetch bookings");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, paymentStatusFilter, clientFilter, providerFilter]
  );

  useEffect(() => {
    fetchBookings(1);
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((booking) => {
      const haystack = [
        booking.id,
        booking.client?.name,
        booking.client?.email,
        booking.provider?.name,
        booking.provider?.email,
        serviceLabel(booking.service),
        booking.address,
        booking.city,
        booking.status,
        booking.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [bookings, searchTerm]);

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
    const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
    const revenue = bookings
      .filter((b) => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      total: totalBookings,
      completed: completedBookings,
      pending: pendingBookings,
      revenue,
    };
  }, [bookings]);

  const openViewBooking = async (booking: AdminBooking) => {
    try {
      setIsProcessing(true);
      const response = await getBookingById(booking.id);

      if (response.success) {
        setDetailedBooking(response.data);
        setIsViewDialogOpen(true);
      } else {
        toast.error(response.message || "Failed to fetch booking details");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch booking details");
    } finally {
      setIsProcessing(false);
    }
  };

  const openUpdateBooking = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setUpdateForm({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
    setIsUpdateDialogOpen(true);
  };

  const openCancelBooking = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    const payload: Partial<{
      status: BookingStatus;
      paymentStatus: PaymentStatus;
    }> = {};

    if (updateForm.status && updateForm.status !== selectedBooking.status) {
      payload.status = updateForm.status;
    }

    if (updateForm.paymentStatus && updateForm.paymentStatus !== selectedBooking.paymentStatus) {
      payload.paymentStatus = updateForm.paymentStatus;
    }

    if (Object.keys(payload).length === 0) {
      toast.error("Please change at least one field before updating");
      return;
    }

    try {
      setIsProcessing(true);
      await updateBooking(selectedBooking.id, payload);
      toast.success("Booking updated successfully");
      setIsUpdateDialogOpen(false);
      setSelectedBooking(null);
      setUpdateForm({ status: "", paymentStatus: "" });
      await fetchBookings(meta.page);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setIsProcessing(true);
      await cancelBooking(selectedBooking.id);
      toast.success("Booking cancelled successfully");
      setIsCancelDialogOpen(false);
      setSelectedBooking(null);
      await fetchBookings(meta.page);
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeViewDialog = () => {
    if (isProcessing) return;
    setIsViewDialogOpen(false);
    setDetailedBooking(null);
  };

  const closeUpdateDialog = () => {
    if (isProcessing) return;
    setIsUpdateDialogOpen(false);
    setSelectedBooking(null);
    setUpdateForm({ status: "", paymentStatus: "" });
  };

  const closeCancelDialog = () => {
    if (isProcessing) return;
    setIsCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentStatusFilter("");
    setClientFilter("");
    setProviderFilter("");
    setSearchTerm("");
  };

  const hasActiveFilters = Boolean(
    statusFilter || paymentStatusFilter || clientFilter || providerFilter || searchTerm
  );

  if (loading && bookings.length === 0) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-600 dark:text-green-400" />
          <div>
            <p className="text-base font-semibold text-black dark:text-white">Loading bookings...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the latest data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-green-50 to-black/5 p-5 shadow-sm dark:border-white/10 dark:from-black dark:via-green-950/20 dark:to-black md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white md:text-4xl">
              Bookings Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Manage all bookings, update statuses, review details, and cancel bookings from one place.
            </p>
          </div>

          <Button
            variant="default"
            className="w-full border border-green-700 bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md dark:border-green-500/30 dark:bg-green-500 dark:text-black dark:hover:bg-green-400 md:w-auto"
            onClick={() => fetchBookings(meta.page)}
            disabled={loading || isProcessing}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          icon={Calendar}
          description="Bookings in the current page data"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          description="Successfully completed bookings"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Awaiting confirmation"
        />
        <StatCard
          title="Total Revenue"
          value={`$${formatMoney(stats.revenue)}`}
          icon={DollarSign}
          description="From paid bookings"
        />
      </div>

      <Card className="border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-black/40">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl text-black dark:text-white">All Bookings</CardTitle>
              <CardDescription>
                Search, filter, and manage bookings from the admin panel.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-black/10 pl-9 focus-visible:ring-2 focus-visible:ring-green-500 dark:border-white/10 sm:w-[260px]"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full border-black/10 bg-white focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-black/30 sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-full border-black/10 bg-white focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-black/30 sm:w-[160px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-black/10 bg-white text-black hover:border-green-500 hover:bg-green-50 dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-green-500/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-[90px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-28 text-center">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          Loading...
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No bookings found</div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="transition-colors hover:bg-green-50/50 dark:hover:bg-green-500/5"
                    >
                      <TableCell className="font-mono text-xs font-medium text-black dark:text-white">
                        {booking.id.slice(-8)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {booking.client?.name || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.client?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Wrench className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {booking.provider?.name || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.provider?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {serviceLabel(booking.service)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${formatMoney(booking.service?.price)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-black dark:text-white">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(booking.bookingDate)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(booking.bookingTime)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold text-black dark:text-white">
                        ${formatMoney(booking.totalAmount)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${bookingStatusColors[booking.status] || ""}`}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${paymentStatusColors[booking.paymentStatus] || ""}`}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isProcessing}
                              className="rounded-full border border-black/10 bg-white text-black hover:bg-green-50 hover:text-green-700 dark:border-white/10 dark:bg-black/20 dark:text-white dark:hover:bg-green-500/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => openViewBooking(booking)}
                              disabled={isProcessing}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openUpdateBooking(booking)}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            {booking.status !== "CANCELLED" && (
                              <DropdownMenuItem
                                onClick={() => openCancelBooking(booking)}
                                disabled={isProcessing}
                                className="text-red-600 focus:text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing page <span className="font-semibold text-black dark:text-white">{meta.page}</span> of{" "}
              <span className="font-semibold text-black dark:text-white">{meta.totalPages}</span> · Total{" "}
              <span className="font-semibold text-black dark:text-white">{meta.total}</span> bookings
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchBookings(meta.page - 1)}
                className="border-black/10 bg-white text-black hover:border-green-500 hover:bg-green-50 dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-green-500/10"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => fetchBookings(meta.page + 1)}
                className="border-black/10 bg-white text-black hover:border-green-500 hover:bg-green-50 dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-green-500/10"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-h-[92vh] w-full max-w-full overflow-y-auto rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-black">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl text-black dark:text-white">Booking Details</DialogTitle>
            <DialogDescription>Complete booking information and service details.</DialogDescription>
          </DialogHeader>

          {detailedBooking ? (
            <div className="space-y-6">
              <Card className="border border-black/10 dark:border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-black dark:text-white">Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DetailItem label="Booking ID" value={detailedBooking.id} />
                    <DetailItem label="Booking Date" value={formatDate(detailedBooking.bookingDate)} />
                    <DetailItem label="Booking Time" value={formatTime(detailedBooking.bookingTime)} />
                    <DetailItem label="Total Amount" value={`$${formatMoney(detailedBooking.totalAmount)}`} />
                    <DetailItem
                      label="Status"
                      value={
                        <Badge className={`rounded-full border px-3 py-1 ${bookingStatusColors[detailedBooking.status] || ""}`}>
                          {detailedBooking.status}
                        </Badge>
                      }
                    />
                    <DetailItem
                      label="Payment Status"
                      value={
                        <Badge className={`rounded-full border px-3 py-1 ${paymentStatusColors[detailedBooking.paymentStatus] || ""}`}>
                          {detailedBooking.paymentStatus}
                        </Badge>
                      }
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-2 text-sm text-black dark:text-white">
                      {detailedBooking.address}, {detailedBooking.city}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border border-black/10 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                      <User className="h-5 w-5 text-green-600" />
                      Client Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold text-black dark:text-white">
                      {detailedBooking.client?.name || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detailedBooking.client?.email || "-"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-black/10 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                      <Wrench className="h-5 w-5 text-green-600" />
                      Provider Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-black dark:text-white">
                        {detailedBooking.provider?.name || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {detailedBooking.provider?.email || "-"}
                      </p>
                    </div>

                    {detailedBooking.provider?.profilePhoto ? (
                      <img
                        src={detailedBooking.provider.profilePhoto}
                        alt={detailedBooking.provider.name}
                        className="h-20 w-20 rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/10"
                      />
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="border border-black/10 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
                      <Star className="h-5 w-5 text-green-600" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-black dark:text-white">
                        {serviceLabel(detailedBooking.service)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {detailedBooking.service?.duration || "-"}
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${formatMoney(detailedBooking.service?.price)}
                      </p>
                    </div>

                    <Badge
                      variant={detailedBooking.service?.isActive ? "default" : "secondary"}
                      className={
                        detailedBooking.service?.isActive
                          ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-black"
                          : "bg-black/10 text-black dark:bg-white/10 dark:text-white"
                      }
                    >
                      {detailedBooking.service?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">Loading details...</div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeViewDialog}
              disabled={isProcessing}
              className="border-black/10 bg-white text-black hover:border-green-500 hover:bg-green-50 dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-green-500/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={closeUpdateDialog}>
        <DialogContent className="max-h-[92vh] w-[96vw] max-w-3xl overflow-y-auto rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-black">
          <DialogHeader>
            <DialogTitle className="text-2xl text-black dark:text-white">Update Booking</DialogTitle>
            <DialogDescription>
              Update status or payment status for booking{" "}
              <span className="font-semibold text-black dark:text-white">
                {selectedBooking?.id?.slice(-8)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedBooking ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Current Status
                  </p>
                  <p className="mt-2 font-medium text-black dark:text-white">{selectedBooking.status}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Current Payment
                  </p>
                  <p className="mt-2 font-medium text-black dark:text-white">{selectedBooking.paymentStatus}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="mt-2 font-medium text-black dark:text-white">${formatMoney(selectedBooking.totalAmount)}</p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">Booking Status</label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      status: value as BookingStatus,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 border-black/10 bg-white focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-black/30">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">Payment Status</label>
                <Select
                  value={updateForm.paymentStatus}
                  onValueChange={(value) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      paymentStatus: value as PaymentStatus,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 border-black/10 bg-white focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-black/30">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
              Backend enum এখন <span className="font-semibold">PENDING / ACCEPTED / WORKING / COMPLETED / CANCELLED</span> এবং{" "}
              <span className="font-semibold">UNPAID / PAID / REFUNDED</span> — এই code ঠিক সেই অনুযায়ী update করা হয়েছে।
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={closeUpdateDialog}
              disabled={isProcessing}
              className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBooking}
              disabled={isProcessing}
              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-black dark:hover:bg-green-400"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={closeCancelDialog}>
        <DialogContent className="max-h-[92vh] w-[96vw] max-w-xl overflow-y-auto rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-black">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-black dark:text-white">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel booking{" "}
              <span className="font-semibold text-black dark:text-white">
                {selectedBooking?.id?.slice(-8)}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            Cancelling will set the booking status to <span className="font-semibold">CANCELLED</span>.
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={closeCancelDialog}
              disabled={isProcessing}
              className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isProcessing}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
