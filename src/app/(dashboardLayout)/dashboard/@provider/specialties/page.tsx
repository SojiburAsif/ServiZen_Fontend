/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  getAllSpecialtiesServerAction,
  getMySpecialtiesServerAction,
  addMySpecialtiesServerAction,
  removeMySpecialtyServerAction,
  Specialty,
} from "@/services/specialties.service";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trash2, PlusCircle, Sparkles, LayoutGrid, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

// --- Helpers ---
const normalizeSpecialtyRecord = (record: any): Specialty | null => {
  if (!record) return null;
  const candidate = record.specialty ? record.specialty : record;
  const id = candidate.id ? String(candidate.id) : "";
  if (!id) return null;
  return {
    id,
    title: candidate.title || candidate.name || "Untitled",
    description: candidate.description,
    icon: candidate.icon,
    isDeleted: candidate.isDeleted,
  };
};

const normalizeSpecialtyList = (payload: unknown): Specialty[] => {
  const extractList = (): any[] => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      const p = payload as any;
      return p.specialties || p.result || (Array.isArray(p.data) ? p.data : p.data?.specialties) || [];
    }
    return [];
  };
  return extractList().map(normalizeSpecialtyRecord).filter((item): item is Specialty => Boolean(item));
};

// Fixed Icon Resolver: Directly get the icon reference
const getLucideIcon = (name?: string | null) => {
  if (!name) return null;
  const trimmed = name.trim();
  return (LucideIcons as any)[trimmed] || null;
};

const SpecialtyIconBadge = ({ icon }: { icon?: string | null }) => {
  const trimmed = icon?.trim() || "";
  
  if (!trimmed) return <div className="w-full h-full bg-emerald-500/10" />;
  
  if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
    return (
      <Image 
        src={trimmed} 
        alt="" 
        width={32} 
        height={32} 
        className="w-full h-full object-cover" 
        unoptimized={trimmed.endsWith(".svg")} 
      />
    );
  }

  const IconComponent = getLucideIcon(trimmed);

  return (
    <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-600">
      {IconComponent ? (
        // Use React.createElement to avoid "component during render" error
        React.createElement(IconComponent, { className: "w-5 h-5" })
      ) : (
        <span className="text-[10px] font-bold">{trimmed.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};

// --- Page Component ---
export default function ProviderSpecialtiesPage() {
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [mySpecialties, setMySpecialties] = useState<Specialty[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [singleSelect, setSingleSelect] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSpecialties = useCallback(async () => {
    setLoading(true);
    try {
      const [all, mine] = await Promise.all([getAllSpecialtiesServerAction(), getMySpecialtiesServerAction()]);
      const allData = all.success ? all.data : [];
      const mineData = mine.success ? mine.data : null;
      setAllSpecialties(normalizeSpecialtyList(allData).filter((s) => !s.isDeleted));
      setMySpecialties(normalizeSpecialtyList(mineData));
      setSelected([]);
      setSingleSelect("");
    } catch {
      toast.error("Failed to load specialties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpecialties(); }, [fetchSpecialties]);

  const handleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setAdding(true);
    try {
      const result = await addMySpecialtiesServerAction(selected);
      if (result.success) {
        toast.success("Specialties published!");
        fetchSpecialties();
      } else {
        toast.error(result.message || "Failed to add");
      }
    } catch (e: any) {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const handleSingleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSelect) return;
    setAdding(true);
    try {
      const result = await addMySpecialtiesServerAction([singleSelect]);
      if (result.success) {
        toast.success("Specialty added");
        fetchSpecialties();
      } else {
        toast.error(result.message || "Failed to add");
      }
    } catch (e: any) {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const result = await removeMySpecialtyServerAction(id);
      if (result.success) {
        toast.success("Removed");
        fetchSpecialties();
      } else {
        toast.error(result.message || "Failed to remove");
      }
    } catch {
      toast.error("Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  const availableSpecialties = useMemo(() => 
    allSpecialties.filter(s => !mySpecialties.some(m => m.id === s.id)),
    [allSpecialties, mySpecialties]
  );

  const stats = [
    { label: "Active", value: mySpecialties.length, icon: CheckCircle2 },
    { label: "Available", value: availableSpecialties.length, icon: LayoutGrid },
    { label: "Total", value: allSpecialties.length, icon: Sparkles },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-[3rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 sm:p-12">
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-zinc-100 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Provider Studio
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                Specialty <span className="text-emerald-500">Manager</span>
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                Customize your professional profile by selecting the expertise that defines your brand. 
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:w-auto md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stats.map((stat, i) => (
              <div key={i} className="group rounded-[2rem] border border-zinc-100 bg-white p-6 transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-col items-center justify-center text-center">
                  <stat.icon className="mb-2 h-5 w-5 text-emerald-600" />
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-3xl" />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Catalog Selection</h2>
                <p className="text-sm font-bold text-zinc-500">Choose multiple to bulk update</p>
              </div>
              {selected.length > 0 && (
                <Button 
                  onClick={handleAdd} 
                  disabled={adding}
                  className="h-12 rounded-2xl bg-emerald-500 px-6 font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600"
                >
                  {adding ? <Loader2 className="mr-2 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Publish {selected.length} Items
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>
            ) : availableSpecialties.length === 0 ? (
              <div className="rounded-[2rem] border-2 border-dashed border-zinc-100 py-12 text-center dark:border-zinc-800">
                <p className="font-bold text-zinc-400">All specialties are currently active.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {availableSpecialties.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className={`group relative cursor-pointer rounded-[2rem] border-2 p-5 transition-all ${
                      selected.includes(s.id) 
                      ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10" 
                      : "border-zinc-50 bg-zinc-50/50 hover:border-emerald-200 dark:border-zinc-900 dark:bg-zinc-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={selected.includes(s.id)} 
                        onCheckedChange={() => handleSelect(s.id)} 
                        className="mt-1 h-5 w-5 rounded-lg border-zinc-300 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500" 
                      />
                      <div>
                        <p className="font-black text-zinc-900 dark:text-white">{s.title}</p>
                        <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-500 line-clamp-2">{s.description || "Expert level specialty"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-2xl dark:bg-zinc-950">
            <h3 className="text-xl font-black uppercase tracking-tight">Quick Add</h3>
            <p className="mb-6 text-sm font-bold text-zinc-400 uppercase tracking-widest">Instantly add a single specialty</p>
            <form onSubmit={handleSingleAdd} className="space-y-4">
              <Select value={singleSelect} onValueChange={setSingleSelect} disabled={adding}>
                <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Browse list..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-800 bg-zinc-950 text-white">
                  {availableSpecialties.map(s => <SelectItem key={s.id} value={s.id} className="rounded-xl focus:bg-emerald-500 focus:text-white">{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={!singleSelect || adding} className="h-14 w-full rounded-2xl bg-white font-black text-zinc-900 hover:bg-zinc-100">
                {adding ? <Loader2 className="animate-spin text-emerald-500" /> : "Confirm Add"}
              </Button>
            </form>
          </div>

          <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Profile Impact</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-600">1</div>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Specialties help customers find you in search results.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-600">2</div>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Verified badges increase trust by up to 40%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Table Section */}
      <section className="overflow-hidden rounded-[3rem] border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4 border-b border-zinc-50 p-8 dark:border-zinc-900 sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Active Specialties</h2>
            <p className="text-sm font-bold text-zinc-500">Currently visible on your public profile</p>
          </div>
          <Badge variant="outline" className="rounded-full border-zinc-200 px-4 py-1 font-black text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">{mySpecialties.length} Total Items</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="py-6 pl-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 w-[300px]">Specialty</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Details</TableHead>
                <TableHead className="py-6 pr-8 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mySpecialties.map((s) => (
                <TableRow key={s.id} className="group border-b border-zinc-50 transition-colors hover:bg-emerald-50/20 dark:border-zinc-900 dark:hover:bg-emerald-500/5">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-transform group-hover:scale-110 dark:border-zinc-800 dark:bg-zinc-800">
                        <SpecialtyIconBadge icon={s.icon} />
                      </div>
                      <div>
                        <p className="font-black text-zinc-900 dark:text-white">{s.title}</p>
                        <Badge className="h-4 border-none bg-emerald-500/10 text-[8px] font-black text-emerald-600">LIVE</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <p className="max-w-md text-sm font-medium text-zinc-500 line-clamp-1 dark:text-zinc-400">{s.description || "A signature professional service specialty."}</p>
                  </TableCell>
                  <TableCell className="py-6 pr-8 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(s.id)}
                      disabled={removingId === s.id}
                      className="h-10 w-10 rounded-xl text-zinc-400 transition-all hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                    >
                      {removingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mySpecialties.length === 0 && !loading && (
            <div className="py-24 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900">
                <LayoutGrid className="h-10 w-10 text-zinc-300" />
              </div>
              <p className="font-bold text-zinc-400">No specialties added yet. Start curating above!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );

}