/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllPayments,
  getPaymentById,
  AdminPayment,
  PaymentFilters,
  PaymentDetailResponse,
} from "@/services/admin-payment.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CreditCard,
  Eye,
  Filter,
  Search,
  User,
  Wrench,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const paymentStatusColors: Record<string, string> = {
  UNPAID: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
  REFUNDED: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400",
};

const moneyFormat = (value?: number | null) => {
  const amount = value ?? 0;
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString: string) => {
  return timeString;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailedPayment, setDetailedPayment] = useState<AdminPayment | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  const fetchPayments = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const filters: PaymentFilters = {
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(dateFromFilter && { dateFrom: dateFromFilter }),
        ...(dateToFilter && { dateTo: dateToFilter }),
      };

      const response = await getAllPayments(filters);

      if (response.success) {
        setPayments(response.data.data);
        setMeta({
          page: response.data.meta.page,
          totalPages: Math.max(1, Math.ceil(response.data.meta.total / response.data.meta.limit)),
          total: response.data.meta.total,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFromFilter, dateToFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return payments;

    return payments.filter((payment) =>
      payment.transactionId.toLowerCase().includes(q) ||
      payment.id.toLowerCase().includes(q) ||
      payment.booking.client.name.toLowerCase().includes(q) ||
      payment.booking.provider.name.toLowerCase().includes(q) ||
      payment.booking.service.name.toLowerCase().includes(q) ||
      payment.bookingId.toLowerCase().includes(q)
    );
  }, [payments, searchTerm]);

  const handleViewPayment = async (payment: AdminPayment) => {
    try {
      setIsProcessing(true);
      const response = await getPaymentById(payment.id);

      if (response.success) {
        setDetailedPayment(response.data);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      toast.error("Failed to fetch payment details");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeViewDialog = () => {
    if (isProcessing) return;
    setIsViewDialogOpen(false);
    setDetailedPayment(null);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setSearchTerm("");
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div>
            <p className="text-base font-semibold">Loading payments...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the latest data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground">
            Monitor all payment transactions across the platform
          </p>
        </div>
      </div>

      <Card className="border-muted/30 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl">All Payments</CardTitle>

            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="w-[130px]"
                />
                <Input
                  type="date"
                  placeholder="To date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="w-[130px]"
                />
              </div>

              {(statusFilter || dateFromFilter || dateToFilter || searchTerm) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" />
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
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        "No payments found"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">
                        {payment.id.slice(-8)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.transactionId.slice(-12)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{payment.booking.client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.booking.client.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{payment.booking.provider.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.booking.provider.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.booking.service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${moneyFormat(payment.booking.service.price)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${moneyFormat(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[payment.status]}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(payment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:text-primary"
                          onClick={() => handleViewPayment(payment)}
                          disabled={isProcessing}
                          aria-label="View payment details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
              <span className="font-medium text-foreground">{meta.totalPages}</span> (
              <span className="font-medium text-foreground">{meta.total}</span> total payments)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchPayments(meta.page - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => fetchPayments(meta.page + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Payment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Payment Details</DialogTitle>
            <DialogDescription>
              Complete payment information and transaction details.
            </DialogDescription>
          </DialogHeader>

          {detailedPayment ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DetailItem label="Payment ID" value={detailedPayment.id} />
                    <DetailItem label="Transaction ID" value={detailedPayment.transactionId} />
                    <DetailItem label="Stripe Event ID" value={detailedPayment.stripeEventId} />
                    <DetailItem
                      label="Amount"
                      value={`$${moneyFormat(detailedPayment.amount)}`}
                    />
                    <DetailItem label="Status" value={
                      <Badge className={paymentStatusColors[detailedPayment.status]}>
                        {detailedPayment.status}
                      </Badge>
                    } />
                    <DetailItem
                      label="Created At"
                      value={new Date(detailedPayment.createdAt).toLocaleString()}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      Client Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{detailedPayment.booking.client.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {detailedPayment.booking.client.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wrench className="h-5 w-5 text-green-600" />
                      Provider Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{detailedPayment.booking.provider.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {detailedPayment.booking.provider.email}
                        </p>
                      </div>
                      {detailedPayment.booking.provider.profilePhoto && (
                        <img
                          src={detailedPayment.booking.provider.profilePhoto}
                          alt={detailedPayment.booking.provider.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5 text-yellow-600" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{detailedPayment.booking.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Price: ${moneyFormat(detailedPayment.booking.service.price)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DetailItem label="Booking ID" value={detailedPayment.booking.id} />
                    <DetailItem
                      label="Booking Date"
                      value={formatDate(detailedPayment.booking.bookingDate)}
                    />
                    <DetailItem
                      label="Booking Time"
                      value={formatTime(detailedPayment.booking.bookingTime)}
                    />
                    <DetailItem
                      label="Total Amount"
                      value={`$${moneyFormat(detailedPayment.booking.totalAmount)}`}
                    />
                    <DetailItem label="Booking Status" value={
                      <Badge className={paymentStatusColors[detailedPayment.booking.status]}>
                        {detailedPayment.booking.status}
                      </Badge>
                    } />
                    <DetailItem label="Payment Status" value={
                      <Badge className={paymentStatusColors[detailedPayment.booking.paymentStatus]}>
                        {detailedPayment.booking.paymentStatus}
                      </Badge>
                    } />
                  </div>
                </CardContent>
              </Card>

              {detailedPayment.paymentGatewayData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stripe Payment Gateway Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(detailedPayment.paymentGatewayData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Loading details...
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeViewDialog} disabled={isProcessing}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}
