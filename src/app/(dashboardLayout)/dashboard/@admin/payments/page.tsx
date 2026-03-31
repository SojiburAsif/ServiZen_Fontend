/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllPayments,
  AdminPayment,
  PaymentFilters,
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
  EyeOff,
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
  DollarSign,
  Hash,
  Mail,
  Phone,
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

      console.log('Fetching payments with filters:', filters);
      const response = await getAllPayments(filters);
      console.log('API Response:', response);

      if (response.success) {
        console.log('Setting payments data:', response.data.data);
        setPayments(response.data.data);
        setMeta({
          page: response.data.meta.page,
          totalPages: Math.max(1, Math.ceil(response.data.meta.total / response.data.meta.limit)),
          total: response.data.meta.total,
        });
      } else {
        console.error('API response not successful:', response);
        toast.error(response.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
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

  const toggleRowExpansion = (paymentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedRows(newExpanded);
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
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No payments found</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            {payment.id.slice(-8)}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-muted-foreground" />
                            {payment.transactionId.slice(-12)}
                          </div>
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
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            {moneyFormat(payment.amount)}
                          </div>
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
                            size="sm"
                            variant="ghost"
                            className="hover:text-primary"
                            onClick={() => toggleRowExpansion(payment.id)}
                            aria-label={expandedRows.has(payment.id) ? "Hide details" : "Show details"}
                          >
                            {expandedRows.has(payment.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={9} className="p-0">
                          {expandedRows.has(payment.id) && (
                            <div className="border-t bg-muted/20 p-6">
                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Payment Details */}
                                <Card className="border-0 shadow-none bg-background/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <CreditCard className="h-5 w-5 text-blue-600" />
                                      Payment Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <DetailItem
                                      icon={<Hash className="h-4 w-4" />}
                                      label="Full Payment ID"
                                      value={payment.id}
                                    />
                                    <DetailItem
                                      icon={<CreditCard className="h-4 w-4" />}
                                      label="Transaction ID"
                                      value={payment.transactionId}
                                    />
                                    <DetailItem
                                      icon={<DollarSign className="h-4 w-4" />}
                                      label="Amount"
                                      value={`$${moneyFormat(payment.amount)}`}
                                    />
                                    <DetailItem
                                      icon={<Calendar className="h-4 w-4" />}
                                      label="Created At"
                                      value={new Date(payment.createdAt).toLocaleString()}
                                    />
                                    <DetailItem
                                      label="Status"
                                      value={
                                        <Badge className={paymentStatusColors[payment.status]}>
                                          {payment.status}
                                        </Badge>
                                      }
                                    />
                                  </CardContent>
                                </Card>

                                {/* Client Details */}
                                <Card className="border-0 shadow-none bg-background/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <User className="h-5 w-5 text-green-600" />
                                      Client Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <DetailItem
                                      icon={<User className="h-4 w-4" />}
                                      label="Name"
                                      value={payment.booking.client.name}
                                    />
                                    <DetailItem
                                      icon={<Mail className="h-4 w-4" />}
                                      label="Email"
                                      value={payment.booking.client.email}
                                    />
                                  </CardContent>
                                </Card>

                                {/* Provider Details */}
                                <Card className="border-0 shadow-none bg-background/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Wrench className="h-5 w-5 text-orange-600" />
                                      Provider Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <DetailItem
                                      icon={<User className="h-4 w-4" />}
                                      label="Name"
                                      value={payment.booking.provider.name}
                                    />
                                    <DetailItem
                                      icon={<Mail className="h-4 w-4" />}
                                      label="Email"
                                      value={payment.booking.provider.email}
                                    />
                                    {payment.booking.provider.profilePhoto && (
                                      <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-muted-foreground">Photo:</span>
                                        <img
                                          src={payment.booking.provider.profilePhoto}
                                          alt={payment.booking.provider.name}
                                          className="w-12 h-12 rounded-full object-cover border-2 border-background"
                                        />
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Service Details */}
                                <Card className="border-0 shadow-none bg-background/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <CreditCard className="h-5 w-5 text-purple-600" />
                                      Service Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <DetailItem
                                      icon={<Wrench className="h-4 w-4" />}
                                      label="Service Name"
                                      value={payment.booking.service.name}
                                    />
                                    <DetailItem
                                      icon={<DollarSign className="h-4 w-4" />}
                                      label="Service Price"
                                      value={`$${moneyFormat(payment.booking.service.price)}`}
                                    />
                                  </CardContent>
                                </Card>

                                {/* Booking Details */}
                                <Card className="border-0 shadow-none bg-background/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Calendar className="h-5 w-5 text-indigo-600" />
                                      Booking Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <DetailItem
                                      icon={<Hash className="h-4 w-4" />}
                                      label="Booking ID"
                                      value={payment.booking.id}
                                    />
                                    <DetailItem
                                      icon={<Calendar className="h-4 w-4" />}
                                      label="Booking Date"
                                      value={formatDate(payment.booking.bookingDate)}
                                    />
                                    <DetailItem
                                      icon={<Clock className="h-4 w-4" />}
                                      label="Booking Time"
                                      value={formatTime(payment.booking.bookingTime)}
                                    />
                                    <DetailItem
                                      icon={<DollarSign className="h-4 w-4" />}
                                      label="Total Amount"
                                      value={`$${moneyFormat(payment.booking.totalAmount)}`}
                                    />
                                    <DetailItem
                                      label="Booking Status"
                                      value={
                                        <Badge className={paymentStatusColors[payment.booking.status]}>
                                          {payment.booking.status}
                                        </Badge>
                                      }
                                    />
                                    <DetailItem
                                      label="Payment Status"
                                      value={
                                        <Badge className={paymentStatusColors[payment.booking.paymentStatus]}>
                                          {payment.booking.paymentStatus}
                                        </Badge>
                                      }
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-medium break-all">{value}</div>
      </div>
    </div>
  );
}
