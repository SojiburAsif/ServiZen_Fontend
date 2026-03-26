"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Filter,
  PauseCircle,
  PencilLine,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";

import { deleteService, getAllServices, updateService, type ServiceListQuery, type ServiceRecord } from "@/services/services.service";
import { ServicesValidation } from "@/zod/services.validation";
import { ServiceEditorSheet } from "@/components/modules/services/service-editor-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

const DEFAULT_LIMIT = 8;
export type SpecialtyOption = { id: string; title: string };

export const ServicesManager = ({ context, providerId, specialtyOptions = [] }: { context: string; providerId?: string; specialtyOptions: SpecialtyOption[] }) => {
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
      const response = await getAllServices({ providerId, limit: 50 });
      setServices(response.data || []);
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
      const res = await updateService(service.id, { isActive: !service.isActive });
      setServices(prev => prev.map(item => item.id === service.id ? res.data : item));
      toast.success(res.data.isActive ? "Service is now live" : "Service hidden");
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete.id);
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
      toast.success("Service deleted");
    } finally { setServiceToDelete(null); }
  };

  return (
    <div className="space-y-6">
      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input 
            placeholder="Search services..." 
            className="pl-10 h-11 rounded-xl border-none bg-white dark:bg-zinc-800 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full md:w-40 rounded-xl border-none bg-white dark:bg-zinc-800 shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Paused Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={fetchServices} className="rounded-xl h-11 w-11 hover:bg-white dark:hover:bg-zinc-800">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Modern Table */}
      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100 h-12">Service Info</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Performance</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-zinc-400">Updating catalog...</TableCell></TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-zinc-400">No services found.</TableCell></TableRow>
            ) : filteredServices.map((service) => (
              <TableRow key={service.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors border-zinc-100 dark:border-zinc-800">
                <TableCell>
                  <div className="py-1">
                    <Link href={`/services/${service.id}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 block transition-colors">
                      {service.name}
                    </Link>
                    <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{service.specialty?.title || "General"}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-zinc-900 dark:text-zinc-100">
                  ৳{service.price}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span>{service.totalPaidBookings || 0} Bookings</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-md px-2 py-0 h-6 border-none font-bold text-[10px] uppercase ${service.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {service.isActive ? 'Live' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleToggleStatus(service)}>
                      {service.isActive ? <PauseCircle size={16} /> : <PlayCircle size={16} className="text-emerald-600" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setSelectedService(service); setEditorOpen(true); }}>
                      <PencilLine size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setServiceToDelete(service)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ServiceEditorSheet open={editorOpen} onOpenChange={setEditorOpen} service={selectedService} specialtyOptions={specialtyOptions} onUpdated={fetchServices} />

      <AlertDialog open={!!serviceToDelete} onOpenChange={(o) => !o && setServiceToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the service listing from the marketplace.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-none bg-zinc-100">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-500 hover:bg-red-600 border-none">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};