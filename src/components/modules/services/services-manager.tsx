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
      {/* Filter Row - Glass Effect */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40 dark:bg-black/20 backdrop-blur-xl p-4 rounded-3xl border border-white/40 dark:border-white/5 shadow-2xl shadow-green-900/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
          <Input 
            placeholder="Search your services..." 
            className="pl-11 h-12 rounded-2xl border-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shadow-inner focus-visible:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 w-full md:w-44 rounded-2xl border-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shadow-inner">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Paused Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={fetchServices} className="rounded-2xl h-12 w-12 bg-white/60 dark:bg-zinc-900/60 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all">
            <RefreshCw className={`h-4 w-4 text-green-700 dark:text-green-400 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table Container - Glass Effect */}
      <div className="rounded-[2rem] border border-white/40 dark:border-white/5 overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-2xl shadow-green-900/5">
        <Table>
          <TableHeader className="bg-white/40 dark:bg-white/5">
            <TableRow className="border-white/20 dark:border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 h-14 pl-6 uppercase text-[11px] tracking-widest">Service Info</TableHead>
              <TableHead className="font-bold uppercase text-[11px] tracking-widest">Price</TableHead>
              <TableHead className="font-bold uppercase text-[11px] tracking-widest text-center">Performance</TableHead>
              <TableHead className="font-bold uppercase text-[11px] tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-6 uppercase text-[11px] tracking-widest">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-48 text-center"><LoaderPulse /></TableCell></TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-48 text-center text-zinc-500 font-medium tracking-tight">No matching services found in your catalog.</TableCell></TableRow>
            ) : filteredServices.map((service) => (
              <TableRow key={service.id} className="group border-white/10 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                <TableCell className="pl-6">
                  <div className="py-2">
                    <Link href={`/services/${service.id}`} className="font-bold text-zinc-900 dark:text-white hover:text-green-600 block transition-colors leading-tight">
                      {service.name}
                    </Link>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mt-1 block">{service.specialty?.title || "General"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-black text-zinc-900 dark:text-white tracking-tighter">৳{service.price}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      <TrendingUp size={12} />
                      <span className="text-[11px] font-bold">{service.totalPaidBookings || 0}</span>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400">Total Bookings</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`rounded-full px-3 py-0.5 h-6 border-none font-black text-[10px] uppercase shadow-sm ${service.isActive ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                    {service.isActive ? 'Live' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-green-500 hover:text-white transition-all shadow-sm" onClick={() => handleToggleStatus(service)}>
                      {service.isActive ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm" onClick={() => { setSelectedService(service); setEditorOpen(true); }}>
                      <PencilLine size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-red-500 hover:text-white transition-all shadow-sm group/del" onClick={() => setServiceToDelete(service)}>
                      <Trash2 size={18} className="group-hover/del:animate-pulse" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ServiceEditorSheet open={editorOpen} onOpenChange={setEditorOpen} service={selectedService} specialtyOptions={specialtyOptions} onUpdated={fetchServices} />

      {/* Modern Alert Dialog */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(o) => !o && setServiceToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Remove Service?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-medium">
              This action cannot be undone. The service will be permanently removed from the marketplace catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl border-none bg-zinc-100 dark:bg-zinc-900 h-12 font-bold px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-2xl bg-red-500 hover:bg-red-600 border-none h-12 font-bold px-6 shadow-lg shadow-red-500/20">Delete Service</AlertDialogAction>
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