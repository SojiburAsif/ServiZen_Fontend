"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PauseCircle,
  PencilLine,
  PlayCircle,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteServiceServerAction,
  getAllServicesServerAction,
  updateServiceServerAction,
  type ServiceRecord
} from "@/services/services.service";
import { ServiceEditorSheet } from "@/components/modules/services/service-editor-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export type SpecialtyOption = { id: string; title: string };

export const ServicesManager = ({ providerId, specialtyOptions = [] }: { context: string; providerId?: string; specialtyOptions: SpecialtyOption[] }) => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllServicesServerAction({ providerId, limit: 50 });
      setServices(response.success ? response.data || [] : []);
    } catch (err) {
      toast.error("Could not load services");
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? s.isActive : !s.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, statusFilter]);

  const handleToggleStatus = async (service: ServiceRecord) => {
    try {
      const response = await updateServiceServerAction(service.id, { isActive: !service.isActive });
      if (response.success && response.data) {
        setServices(prev => prev.map(item => item.id === service.id ? response.data : item));
        toast.success(response.data.isActive ? "Service is now live" : "Service hidden");
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      const response = await deleteServiceServerAction(serviceToDelete.id);
      if (response.success) {
        setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
        toast.success("Service deleted");
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } finally { setServiceToDelete(null); }
  };

  return (
    <div className="space-y-6">
      {/* Tactical Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl text-white">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search your services..." 
            className="pl-12 h-14 rounded-2xl border-none bg-zinc-800/50 dark:bg-black/50 text-white placeholder:text-zinc-500 font-bold focus-visible:ring-1 focus-visible:ring-emerald-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-full md:w-48 rounded-2xl border-none bg-zinc-800/50 dark:bg-black/50 text-white font-bold tracking-tight">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-800 bg-black text-white shadow-2xl">
              <SelectItem value="all" className="font-bold focus:bg-emerald-500 focus:text-black">All Catalog</SelectItem>
              <SelectItem value="active" className="font-bold focus:bg-emerald-500 focus:text-black">Active Only</SelectItem>
              <SelectItem value="inactive" className="font-bold focus:bg-emerald-500 focus:text-black">Hidden Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={fetchServices} className="rounded-2xl h-14 w-14 bg-zinc-800/50 dark:bg-black/50 hover:bg-emerald-500 hover:text-black transition-all group">
            <RefreshCw className={`h-5 w-5 text-zinc-400 group-hover:text-black ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-black shadow-2xl shadow-zinc-900/5">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableRow className="border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
              <TableHead className="font-black text-zinc-400 dark:text-zinc-500 h-16 pl-10 uppercase text-[10px] tracking-[0.2em]">Service Architecture</TableHead>
              <TableHead className="font-black text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-[0.2em]">Financials</TableHead>
              <TableHead className="font-black text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-[0.2em] text-center">Volume</TableHead>
              <TableHead className="font-black text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-[0.2em]">Status</TableHead>
              <TableHead className="text-right pr-10 font-black text-zinc-400 dark:text-zinc-500 uppercase text-[10px] tracking-[0.2em]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-64 text-center"><LoaderPulse /></TableCell></TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-64 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 rounded-full bg-zinc-50 dark:bg-zinc-900">
                    <Search className="h-8 w-8 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500 font-bold tracking-tight">No services found in this category.</p>
                </div>
              </TableCell></TableRow>
            ) : filteredServices.map((service) => (
              <TableRow key={service.id} className="group border-zinc-50 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all duration-300">
                <TableCell className="pl-10 h-24">
                  <div className="flex flex-col">
                    <Link href={`/services/${service.id}`} className="font-black text-lg text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors leading-none mb-1">
                      {service.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2 group-hover:border-emerald-500/30 transition-colors">
                        {service.specialty?.title || "General"}
                      </Badge>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">ID: {service.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">৳{service.price}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/50 transition-all">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-xs font-black">{service.totalPaidBookings || 0}</span>
                    </div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em]">Revenue Unit</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${service.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${service.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}>
                      {service.isActive ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-500 hover:text-black transition-all" onClick={() => handleToggleStatus(service)}>
                      {service.isActive ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all" onClick={() => { setSelectedService(service); setEditorOpen(true); }}>
                      <PencilLine size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-red-500 hover:text-white transition-all group/del" onClick={() => setServiceToDelete(service)}>
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ServiceEditorSheet open={editorOpen} onOpenChange={setEditorOpen} service={selectedService} specialtyOptions={specialtyOptions} onUpdated={fetchServices} />

      {/* High-Contrast Alert Dialog */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(o) => !o && setServiceToDelete(null)}>
        <AlertDialogContent className="rounded-[3rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black tracking-tight leading-none text-zinc-900 dark:text-white">Delete <span className="text-red-500">Service?</span></AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-bold text-lg mt-4">
              This will permanently purge this offering from your catalog. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="rounded-2xl border-none bg-zinc-100 dark:bg-zinc-900 h-14 font-black px-8">ABORT</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-2xl bg-red-500 hover:bg-red-600 border-none h-14 font-black px-8 shadow-xl shadow-red-500/20">CONFIRM PURGE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Simple pulse loader for table
const LoaderPulse = () => (
  <div className="flex flex-col items-center gap-3">
    <div className="flex gap-1">
      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce"></div>
    </div>
    <span className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Refreshing Catalog</span>
  </div>
);