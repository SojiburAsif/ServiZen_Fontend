/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllProviders,
  getProviderById,
  deleteProvider,
  updateProviderStatus,
  ProviderListItem,
  ProviderDetailedProfile,
} from "@/services/provider.service";
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
  Mail,
  Trash2,
  Eye,
  Search,
  UserCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Loader2,
  Phone,
  Star,
  RefreshCcw,
  X,
  Building2,
  BadgeCheck,
  Users,
  Edit2,
  User,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  ACTIVE:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
  BLOCKED:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
  DELETED:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-500",
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
};

const moneyFormat = (value?: number | null) => {
  const amount = value ?? 0;
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

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
    <Card className="border-muted/30 shadow-sm bg-card/80 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderListItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailedProvider, setDetailedProvider] = useState<ProviderDetailedProfile | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [providerToRestore, setProviderToRestore] = useState<ProviderListItem | null>(null);

  const fetchProviders = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getAllProviders(page, 10);

      if (response) {
        setProviders(response.data);
        setMeta({
          page: response.meta.page,
          totalPages: Math.max(1, Math.ceil(response.meta.total / response.meta.limit)),
          total: response.meta.total,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch providers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const filteredProviders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return providers;

    return providers.filter((provider) => {
      const name = provider.name?.toLowerCase() ?? "";
      const email = provider.email?.toLowerCase() ?? "";
      const phone = provider.contactNumber?.toLowerCase() ?? "";
      const reg = provider.registrationNumber?.toLowerCase() ?? "";
      const status = provider.user?.status?.toLowerCase() ?? "";

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        reg.includes(q) ||
        status.includes(q)
      );
    });
  }, [providers, searchTerm]);

  const stats = useMemo(() => {
    const active = providers.filter((p) => p.user?.status === "ACTIVE").length;
    const blocked = providers.filter((p) => p.user?.status === "BLOCKED").length;
    const pending = providers.filter((p) => p.user?.status === "PENDING").length;

    return { active, blocked, pending };
  }, [providers]);

  const handleViewProvider = async (provider: ProviderListItem) => {
    setIsProcessing(true);
    try {
      const providerDetails = await getProviderById(provider.id);
      if (providerDetails) {
        setDetailedProvider(providerDetails);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load provider details");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProvider = async () => {
    if (!selectedProvider) return;

    setIsProcessing(true);
    try {
      await deleteProvider(selectedProvider.id);
      toast.success("Provider deleted successfully");

      if (
        isViewDialogOpen &&
        detailedProvider &&
        detailedProvider.id === selectedProvider.id
      ) {
        setIsViewDialogOpen(false);
        setDetailedProvider(null);
      }

      setIsDeleteDialogOpen(false);
      setSelectedProvider(null);

      const nextPage =
        filteredProviders.length <= 1 && meta.page > 1 ? meta.page - 1 : meta.page;

      await fetchProviders(nextPage);
    } catch (error) {
      toast.error("Failed to delete provider");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeDeleteDialog = () => {
    if (isProcessing) return;
    setIsDeleteDialogOpen(false);
    setSelectedProvider(null);
  };

  const closeViewDialog = () => {
    if (isProcessing) return;
    setIsViewDialogOpen(false);
    setDetailedProvider(null);
  };

  const handleRestoreProvider = async () => {
    if (!providerToRestore) return;

    setIsProcessing(true);
    try {
      await updateProviderStatus(providerToRestore.id, false);
      toast.success("Provider restored successfully");

      setIsRestoreDialogOpen(false);
      setProviderToRestore(null);

      await fetchProviders(meta.page);
    } catch (error) {
      toast.error("Failed to restore provider");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeRestoreDialog = () => {
    if (isProcessing) return;
    setIsRestoreDialogOpen(false);
    setProviderToRestore(null);
  };

  if (loading && providers.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div>
            <p className="text-base font-semibold">Loading providers...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the latest data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5" />
            Admin panel
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Provider Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              View, search, inspect, and manage all service providers from one place.
            </p>
          </div>
        </div>

        <Card className="border-none bg-primary/5 shadow-none">
          <CardContent className="flex items-center gap-4 px-6 py-4">
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Total Providers
              </p>
              <p className="text-2xl font-black">{meta.total}</p>
            </div>
            <UserCheck className="h-9 w-9 text-primary opacity-60" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Visible on page"
          value={filteredProviders.length}
          icon={Users}
          description="Providers matching your current search."
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={BadgeCheck}
          description="Approved and currently active."
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Building2}
          description="Waiting for review or approval."
        />
        <StatCard
          title="Blocked"
          value={stats.blocked}
          icon={ShieldAlert}
          description="Restricted providers."
        />
      </div>

      <Card className="overflow-hidden border-muted/30 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Providers list</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Search by name, email, phone number, registration number, or status.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[540px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  className="pl-10 pr-10 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => fetchProviders(meta.page)}
                disabled={loading}
                className="shrink-0"
              >
                <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="min-w-[260px] font-bold">
                    Provider Information
                  </TableHead>
                  <TableHead className="min-w-[220px] font-bold">
                    Contact & Rating
                  </TableHead>
                  <TableHead className="min-w-[120px] font-bold">Status</TableHead>
                  <TableHead className="px-6 text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-72 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="rounded-full bg-muted p-4">
                          <ShieldAlert className="h-8 w-8 opacity-40" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            No providers found
                          </p>
                          <p className="text-sm">
                            Try a different search term or refresh the list.
                          </p>
                        </div>
                        {searchTerm && (
                          <Button variant="outline" onClick={() => setSearchTerm("")}>
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id} className="transition-colors hover:bg-muted/30">
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-base font-bold">
                            {provider.name || "Unnamed Provider"}
                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {provider.email}
                          </span>

                          {provider.registrationNumber && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Briefcase className="h-3.5 w-3.5" />
                              Reg: {provider.registrationNumber}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          {provider.contactNumber ? (
                            <span className="flex items-center gap-1.5 text-xs">
                              <Phone className="h-3.5 w-3.5" />
                              {provider.contactNumber}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No phone number</span>
                          )}

                          <span className="flex items-center gap-1.5 text-xs">
                            <Star className="h-3.5 w-3.5 text-yellow-500" />
                            {typeof provider.averageRating === "number"
                              ? provider.averageRating.toFixed(1)
                              : "0.0"}{" "}
                            rating
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {provider.specialties?.length || 0} specialties
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={statusColors[provider.user?.status || "ACTIVE"]}>
                          {provider.user?.status || "ACTIVE"}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-primary"
                            onClick={() => handleViewProvider(provider)}
                            disabled={isProcessing}
                            aria-label="View provider details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {provider.user?.status === "DELETED" ? (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:text-emerald-600"
                              onClick={() => {
                                setProviderToRestore(provider);
                                setIsRestoreDialogOpen(true);
                              }}
                              disabled={isProcessing}
                              aria-label="Restore provider"
                            >
                              <User className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:text-rose-600"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={isProcessing}
                              aria-label="Delete provider"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
              <span className="font-medium text-foreground">{meta.totalPages}</span>
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchProviders(meta.page - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => fetchProviders(meta.page + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Provider Details</DialogTitle>
            <DialogDescription>
              Complete profile and financial information for the selected provider.
            </DialogDescription>
          </DialogHeader>

          {detailedProvider ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DetailItem label="Name" value={detailedProvider.name || "N/A"} />
                    <DetailItem label="Email" value={detailedProvider.email || "N/A"} />
                    <DetailItem
                      label="Contact Number"
                      value={detailedProvider.contactNumber || "N/A"}
                    />
                    <DetailItem
                      label="Registration Number"
                      value={detailedProvider.registrationNumber || "N/A"}
                    />
                    <DetailItem
                      label="Experience"
                      value={
                        detailedProvider.experience
                          ? `${detailedProvider.experience} years`
                          : "N/A"
                      }
                    />
                    <DetailItem
                      label="Average Rating"
                      value={
                        typeof detailedProvider.averageRating === "number"
                          ? `${detailedProvider.averageRating.toFixed(1)} ⭐`
                          : "N/A"
                      }
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                    <p className="rounded-md bg-muted/50 p-3 text-sm">
                      {detailedProvider.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
                      {detailedProvider.address || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-500/10">
                      <div className="mb-2 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          Wallet Balance
                        </p>
                      </div>
                      <p className="text-2xl font-black text-emerald-600">
                        ${moneyFormat(detailedProvider.walletBalance)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-500/10">
                      <div className="mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          Total Earned
                        </p>
                      </div>
                      <p className="text-2xl font-black text-blue-600">
                        ${moneyFormat(detailedProvider.totalEarned)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {detailedProvider.specialties && detailedProvider.specialties.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {detailedProvider.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty.specialty?.title || "Unknown Specialty"}
                        </Badge>
                      ))}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedProvider?.name || "this provider"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={closeDeleteDialog} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProvider}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRestoreDialogOpen} onOpenChange={closeRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Restore Provider
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-semibold text-foreground">
                {providerToRestore?.name || "this provider"}
              </span>
              ? The provider will be able to access their account again.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={closeRestoreDialog} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleRestoreProvider}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restore Provider
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
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
