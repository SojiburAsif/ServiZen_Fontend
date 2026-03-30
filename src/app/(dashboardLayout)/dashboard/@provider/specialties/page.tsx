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
    <main className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-black dark:via-zinc-950 dark:to-black py-12 px-4 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-[40px] bg-white border border-emerald-100 dark:bg-zinc-900/50 dark:border-white/5 p-8 lg:p-12 shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
                Provider Studio
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">
                Specialty <span className="text-emerald-500">Manager</span>
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                Customize your professional profile by selecting the expertise that defines your brand. 
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center w-28 h-28 rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 transition-transform hover:scale-105">
                  <stat.icon className="w-5 h-5 text-emerald-600 mb-2" />
                  <span className="text-2xl font-black">{stat.value}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[32px] bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Catalog Selection</h2>
                  <p className="text-sm text-zinc-500">Choose multiple to bulk update</p>
                </div>
                {selected.length > 0 && (
                  <Button 
                    onClick={handleAdd} 
                    disabled={adding}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold shadow-lg shadow-emerald-500/20"
                  >
                    {adding ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                    Publish {selected.length} Items
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
              ) : availableSpecialties.length === 0 ? (
                <div className="text-center py-12 rounded-3xl border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                  <p className="text-zinc-400 font-medium">All specialties are currently active.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {availableSpecialties.map((s) => (
                    <div 
                      key={s.id}
                      onClick={() => handleSelect(s.id)}
                      className={`group cursor-pointer relative p-5 rounded-3xl border-2 transition-all ${
                        selected.includes(s.id) 
                        ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10" 
                        : "border-zinc-50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox checked={selected.includes(s.id)} onCheckedChange={() => handleSelect(s.id)} className="mt-1 rounded-full border-zinc-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" />
                        <div>
                          <p className="font-bold">{s.title}</p>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{s.description || "Expert level specialty"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-zinc-950 dark:bg-emerald-600 p-8 text-white shadow-xl">
              <h3 className="text-xl font-black mb-2">Quick Add</h3>
              <p className="text-sm opacity-80 mb-6">Instantly add a single specialty</p>
              <form onSubmit={handleSingleAdd} className="space-y-4">
                <Select value={singleSelect} onValueChange={setSingleSelect} disabled={adding}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-2xl h-12">
                    <SelectValue placeholder="Browse list..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {availableSpecialties.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={!singleSelect || adding} className="w-full h-12 rounded-2xl bg-white text-emerald-600 hover:bg-emerald-50 dark:text-emerald-700 font-black">
                  {adding ? <Loader2 className="animate-spin" /> : "Confirm Add"}
                </Button>
              </form>
            </div>

            <div className="rounded-[32px] bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 p-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-6">Profile Impact</h4>
              <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold">1</div>
                  <p className="text-sm font-medium">Specialties help customers find you in search results.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold">2</div>
                  <p className="text-sm font-medium">Verified badges increase trust by up to 40%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Table Section */}
        <section className="rounded-[40px] bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Active Specialties</h2>
              <p className="text-sm text-zinc-500">Currently visible on your public profile</p>
            </div>
            <Badge variant="outline" className="rounded-full px-4 py-1 font-bold border-zinc-200">{mySpecialties.length} Total Items</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-black/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[300px] font-bold text-zinc-400 py-6 pl-8 uppercase text-[10px] tracking-widest">Specialty</TableHead>
                  <TableHead className="font-bold text-zinc-400 py-6 uppercase text-[10px] tracking-widest">Details</TableHead>
                  <TableHead className="text-right font-bold text-zinc-400 py-6 pr-8 uppercase text-[10px] tracking-widest">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySpecialties.map((s) => (
                  <TableRow key={s.id} className="group border-b border-zinc-50 dark:border-white/5 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110 bg-white dark:bg-zinc-800">
                          <SpecialtyIconBadge icon={s.icon} />
                        </div>
                        <div>
                          <p className="font-black">{s.title}</p>
                          <Badge className="h-4 text-[8px] bg-emerald-500/10 text-emerald-600 border-none">LIVE</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md line-clamp-1">{s.description || "A signature professional service specialty."}</p>
                    </TableCell>
                    <TableCell className="py-6 pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(s.id)}
                        disabled={removingId === s.id}
                        className="rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        {removingId === s.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={18} />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {mySpecialties.length === 0 && !loading && (
              <div className="py-20 text-center">
                <LayoutGrid className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-400 font-medium">No specialties added yet. Start curating above!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}