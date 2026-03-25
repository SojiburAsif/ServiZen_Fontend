/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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
import { toast } from "sonner";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function ProviderSpecialtiesPage() {
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [mySpecialties, setMySpecialties] = useState<Specialty[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [singleSelect, setSingleSelect] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const providerToken = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchSpecialties = useCallback(async () => {
    setLoading(true);
    try {
      const [all, mine] = await Promise.all([
        getAllSpecialties(),
        getMySpecialties(providerToken),
      ]);
      setAllSpecialties(all?.data?.filter((s: any) => !s.isDeleted) || []);
      let mineData: Specialty[] = [];
      if (Array.isArray(mine?.data)) {
        mineData = mine.data as Specialty[];
      } else if (mine?.data && Array.isArray((mine.data as any).result)) {
        mineData = (mine.data as any).result;
      }
      setMySpecialties(mineData);
      setSelected([]);
      setSingleSelect("");
    } catch {
      toast.error("Failed to load specialties");
    } finally {
      setLoading(false);
    }
  }, [providerToken]);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

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

  // Single add (dropdown)
  const handleSingleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSelect) return;
    setAdding(true);
    try {
      await addMySpecialties([singleSelect], providerToken);
      toast.success("Specialty added to your profile");
      fetchSpecialties();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add specialty");
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

  const availableSpecialties = allSpecialties.filter(
    (s) => Array.isArray(mySpecialties) ? !mySpecialties.some((m) => m.id === s.id) : true
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <PlusCircle className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black uppercase tracking-tight">Manage Specialties</h1>
      </div>

      {/* Add Specialties Section (Multi-select) */}
      <div className="mb-8 p-6 border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4">Add Multiple Specialties</h2>
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

      {/* Add Single Specialty (Dropdown) */}
      <div className="mb-10 p-6 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl bg-white/80 dark:bg-slate-900/60 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4">Add Specialty to Profile</h2>
        <form onSubmit={handleSingleAdd} className="flex flex-col sm:flex-row gap-3 items-center">
          <Select value={singleSelect} onValueChange={setSingleSelect} disabled={adding || loading}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a specialty to add" />
            </SelectTrigger>
            <SelectContent>
              {availableSpecialties.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={adding || !singleSelect}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8"
          >
            {adding ? <Loader2 className="animate-spin mr-2" /> : null}
            Add to Profile
          </Button>
        </form>
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
                        {s.icon ? (
                          <Image src={s.icon} alt="" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-100" />
                        )}
                      </div>
                      {s.title}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 max-w-50 truncate">
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