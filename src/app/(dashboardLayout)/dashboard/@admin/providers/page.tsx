"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BadgeCheck,
  Building2,
  Eye,
  Search,
  ShieldAlert,
  Star,
  Users,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllProviders,
  getProviderById,
  deleteProvider,
  ProviderListItem,
  ProviderDetailedProfile,
} from "@/services/provider.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500 text-white border-none",
  BLOCKED: "bg-red-500 text-white border-none",
  DELETED: "bg-zinc-400 text-white border-none",
  PENDING: "bg-amber-500 text-white border-none",
};

const formatMoney = (value?: number | null) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/5 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
      <div className="text-sm font-bold text-zinc-900 dark:text-white">{value}</div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: React.ElementType; description: string }) {
  return (
    <Card className="group overflow-hidden bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 leading-none">{title}</p>
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-none">{value}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-900">
          <p className="text-[8px] font-medium text-zinc-400 uppercase tracking-widest">{description}</p>
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
    } catch { toast.error("Failed to fetch"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProviders(1); }, [fetchProviders]);

  const filteredProviders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? providers.filter(p => p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.contactNumber?.toLowerCase().includes(q)) : providers;
  }, [providers, searchTerm]);

  const stats = useMemo(() => ({
    active: providers.filter(p => p.user?.status === "ACTIVE").length,
    blocked: providers.filter(p => p.user?.status === "BLOCKED").length,
    pending: providers.filter(p => p.user?.status === "PENDING").length,
    total: meta.total
  }), [providers, meta.total]);

  const handleViewProvider = async (provider: ProviderListItem) => {
    try {
      setIsProcessing(true);
      const data = await getProviderById(provider.id);
      if (data) { setDetailedProvider(data); setIsViewDialogOpen(true); }
    } catch { toast.error("Failed to load details"); } finally { setIsProcessing(false); }
  };

  const handleDeleteProvider = async () => {
    if (!selectedProvider) return;
    try {
      setIsProcessing(true);
      await deleteProvider(selectedProvider.id);
      toast.success("Provider deleted");
      setIsDeleteDialogOpen(false);
      fetchProviders(meta.page);
    } catch { toast.error("Failed"); } finally { setIsProcessing(false); }
  };

  if (loading && providers.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />)}
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-24 animate-pulse rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-2 mb-2">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[8px] font-black tracking-widest uppercase w-fit">
          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-zinc-400 opacity-75"></span><span className="relative h-1.5 w-1.5 bg-zinc-500 rounded-full"></span></span>
          Control Center
        </div>
        <h1 className="text-2xl font-black tracking-tight uppercase text-zinc-900 dark:text-white">Providers Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Volume" value={stats.total} icon={Users} description="Registered entities" />
        <StatCard title="Active" value={stats.active} icon={BadgeCheck} description="Verified & Operational" />
        <StatCard title="Awaiting" value={stats.pending} icon={Building2} description="Pending authorization" />
        <StatCard title="Restricted" value={stats.blocked} icon={ShieldAlert} description="Access terminated" />
      </div>

      <Card className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden">
        <CardHeader className="p-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />Entity Directory
            </CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[200px] md:w-[300px] h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="bg-zinc-50 dark:bg-zinc-900/50 border-none">
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Identity / Email</TableHead>
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Professional Profile</TableHead>
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</TableHead>
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id} className="group border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <TableCell className="py-6 px-8">
                      <div className="font-black text-zinc-900 dark:text-white uppercase truncate max-w-[200px]">{provider.name}</div>
                      <div className="text-[10px] text-zinc-400 uppercase font-black truncate max-w-[200px]">{provider.email}</div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-3 w-3 text-zinc-900 dark:text-white fill-current" />
                        <span className="font-black text-xs text-zinc-900 dark:text-white">{provider.averageRating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase font-black">EXP: {provider.experience || "0"} YEARS</div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusColors[provider.user?.status || "ACTIVE"]}`}>
                        {provider.user?.status || "ACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProvider(provider)} className="rounded-xl h-10 w-10 border border-zinc-100 dark:border-zinc-800"><Eye className="h-4 w-4" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl h-10 w-10"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                               <DropdownMenuItem className="font-black text-[10px] tracking-widest uppercase text-red-500 gap-2 py-3" onClick={() => { setSelectedProvider(provider); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /> TERMINATE</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Page {meta.page} OF {meta.totalPages} • TOTAL {meta.total} ENTRIES</span>
            <div className="flex gap-3">
              <Button variant="outline" disabled={meta.page <= 1} onClick={() => fetchProviders(meta.page - 1)} className="rounded-xl h-10 px-6 font-black border-zinc-200 dark:border-zinc-800">PREV</Button>
              <Button variant="outline" disabled={meta.page >= meta.totalPages} onClick={() => fetchProviders(meta.page + 1)} className="rounded-xl h-10 px-6 font-black border-zinc-200 dark:border-zinc-800">NEXT</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-10 max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader><DialogTitle className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Profile Extract</DialogTitle></DialogHeader>
          {detailedProvider && (
            <div className="space-y-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem label="Legal Name" value={detailedProvider.name} />
                <DetailItem label="Identity Email" value={detailedProvider.email} />
                <DetailItem label="Contact Link" value={detailedProvider.contactNumber} />
                <DetailItem label="Reg Matrix" value={detailedProvider.registrationNumber} />
                <DetailItem label="Experience" value={`${detailedProvider.experience} Years`} />
                <DetailItem label="Avg Score" value={`${detailedProvider.averageRating?.toFixed(1) || "0.0"} / 5.0`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-900 bg-black p-6 text-white dark:border-white dark:bg-white dark:text-black">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Wallet Liquidity</p>
                  <p className="text-3xl font-black">${formatMoney(detailedProvider.walletBalance)}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 p-6 text-zinc-900 dark:text-white dark:border-zinc-800">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Gross Earnings</p>
                  <p className="text-3xl font-black">${formatMoney(detailedProvider.totalEarned)}</p>
                </div>
              </div>
              <DetailItem label="Address Coordinates" value={detailedProvider.address} />
            </div>
          )}
          <DialogFooter><Button onClick={() => setIsViewDialogOpen(false)} className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg">ESCAPE VIEW</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-10 max-w-xl text-center">
           <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 mb-6"><Trash2 size={32}/></div>
           <DialogHeader><DialogTitle className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase mb-2">Terminate Access</DialogTitle></DialogHeader>
           <p className="font-bold text-zinc-400">Are you prepared to strip access rights for <span className="text-zinc-900 dark:text-white">{selectedProvider?.name}</span>? This action is logged.</p>
           <DialogFooter className="mt-8 flex gap-4">
             <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="h-14 rounded-2xl font-black flex-1 uppercase">Abort</Button>
             <Button variant="destructive" onClick={handleDeleteProvider} disabled={isProcessing} className="h-14 rounded-2xl font-black bg-red-600 flex-1 uppercase">Confirm Termination</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
