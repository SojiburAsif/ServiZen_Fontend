/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  getAllSpecialties,
  getMySpecialties,
  addMySpecialties,
  removeMySpecialty,
  Specialty,
} from "@/services/specialties.service";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // Sonner use koro for better UI
import { Loader2, Trash2, PlusCircle } from "lucide-react";

export default function ProviderSpecialtiesPage() {
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  // Ensure mySpecialties is ALWAYS an array
  const [mySpecialties, setMySpecialties] = useState<Specialty[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const providerToken = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const [all, mine] = await Promise.all([
        getAllSpecialties(),
        getMySpecialties(providerToken),
      ]);

      // API theke data array na ashle empty array set kora hoyeche
      setAllSpecialties(all?.data?.filter((s: any) => !s.isDeleted) || []);
      
      // Error fix: Ensure we are setting an array
      const mineData = Array.isArray(mine?.data) ? mine.data : mine?.data?.result || [];
      setMySpecialties(mineData);
      
      setSelected([]);
    } catch (e) {
      toast.error("Failed to load specialties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setAdding(true);
    try {
      await addMySpecialties(selected, providerToken);
      toast.success("Specialties added successfully");
      fetchSpecialties();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add specialties");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeMySpecialty(id, providerToken);
      toast.success("Specialty removed");
      fetchSpecialties();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to remove specialty");
    } finally {
      setRemovingId(null);
    }
  };

  // Safe filtering: mySpecialties array kina seta check kora hocche
  const availableSpecialties = allSpecialties.filter(
    (s) => {
        if (!Array.isArray(mySpecialties)) return true;
        return !mySpecialties.some((m) => m.id === s.id);
    }
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <PlusCircle className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black uppercase tracking-tight">Manage Specialties</h1>
      </div>

      {/* Add Specialties Section */}
      <div className="mb-10 p-6 border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4">Available Categories</h2>
        
        {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-500" /></div>
        ) : availableSpecialties.length === 0 ? (
          <div className="text-muted-foreground text-sm italic">No new specialties available to add.</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableSpecialties.map((s) => (
                <div key={s.id} 
                     onClick={() => handleSelect(s.id)}
                     className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        selected.includes(s.id) 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" 
                        : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-300"
                     }`}>
                  <Checkbox
                    checked={selected.includes(s.id)}
                    onCheckedChange={() => handleSelect(s.id)}
                    disabled={adding}
                  />
                  <span className="text-sm font-bold">{s.title}</span>
                </div>
              ))}
            </div>
            <Button 
                onClick={handleAdd} 
                disabled={adding || selected.length === 0}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8"
            >
              {adding ? <Loader2 className="animate-spin mr-2" /> : null}
              Add Selected ({selected.length})
            </Button>
          </div>
        )}
      </div>

      {/* My Specialties Table */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
           <h2 className="text-sm font-black uppercase tracking-widest">Your Active Specialties</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="text-right font-bold pr-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  </TableCell>
                </TableRow>
              ) : mySpecialties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-zinc-500 font-medium">
                    You haven&apos;t added any specialties yet.
                  </TableCell>
                </TableRow>
              ) : (
                mySpecialties.map((s) => (
                  <TableRow key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <TableCell className="font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white">
                        {s.icon ? <img src={s.icon} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-emerald-100" />}
                      </div>
                      {s.title}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 max-w-[200px] truncate">
                      {s.description || "N/A"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(s.id)}
                        disabled={removingId === s.id}
                        className="text-red-500 hover:text-white hover:bg-red-500 rounded-lg"
                      >
                        {removingId === s.id ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}