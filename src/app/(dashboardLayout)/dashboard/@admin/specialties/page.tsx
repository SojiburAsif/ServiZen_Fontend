/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { 
  getAllSpecialtiesServerAction, 
  createSpecialtyServerAction, 
  deleteSpecialtyServerAction, 
  Specialty 
} from "@/services/specialties.service";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogFooter, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  UploadCloud, 
  Loader2, 
  LayoutGrid,
  Settings2,
  FileText,
  Sparkles
} from "lucide-react";
import { env } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // <-- Sonner toast import

const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(result.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, ""));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
};

const uploadToImgbb = async (base64Image: string) => {
  const formData = new FormData();
  formData.append("image", base64Image);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${env.NEXT_PUBLIC_IIMGBB_KEY}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  return json?.data?.url as string;
};

export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", icon: "" });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const adminToken = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await getAllSpecialtiesServerAction();
      const data = res.success ? res.data : [];
      setSpecialties(data?.filter((s) => !s.isDeleted) || []);
    } catch (e) {
      toast.error("Failed to load specialties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const promise = async () => {
      const base64 = await getBase64(file);
      const url = await uploadToImgbb(base64);
      setForm((prev) => ({ ...prev, icon: url }));
      return url;
    };

    toast.promise(promise(), {
      loading: 'Uploading image...',
      success: 'Image uploaded successfully!',
      error: 'Image upload failed.',
    });
    
    setUploading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const result = await createSpecialtyServerAction(form);
      if (result.success) {
        toast.success("Specialty created successfully!", {
          description: `${form.title} has been added to the categories.`,
        });
        setForm({ title: "", description: "", icon: "" });
        fetchSpecialties();
      } else {
        toast.error(result.message || "Failed to create specialty");
      }
    } catch (e: any) {
      toast.error("Failed to create specialty");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const result = await deleteSpecialtyServerAction(id);
      if (result.success) {
        toast.success("Specialty deleted", {
          description: `${title} was removed successfully.`,
        });
        fetchSpecialties();
      } else {
        toast.error(result.message || "Failed to delete specialty");
      }
    } catch (e: any) {
      toast.error("Failed to delete specialty");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-y-auto bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white font-sans selection:bg-green-300">
      
      <div className="container max-w-7xl mx-auto py-10 px-6 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-600/20 text-white">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                Special<span className="text-green-600">ties</span>
              </h1>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 justify-center md:justify-start">
              <Sparkles size={14} className="text-green-600" /> Marketplace Categories
            </p>
          </div>
          <Badge className="px-6 py-2 text-xs font-black uppercase tracking-widest bg-zinc-900 text-white dark:bg-white dark:text-black border-none rounded-full shadow-lg">
            Admin Control
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Create Form */}
          <Card className="xl:col-span-5 border-none shadow-2xl bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[2.5rem] ring-1 ring-black/5 dark:ring-white/10">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                Add New Specialty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <Settings2 size={12} /> Title
                  </label>
                  <Input 
                    placeholder="Home Cleaning, Plumbing..." 
                    value={form.title} 
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required 
                    className="h-12 bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-green-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <FileText size={12} /> Description
                  </label>
                  <Textarea 
                    placeholder="Briefly explain this service category..." 
                    value={form.description} 
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 min-h-[100px] rounded-xl focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <ImageIcon size={12} /> Visual Media
                  </label>
                  <div className="relative group border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 transition-all hover:border-green-500 bg-white/30 dark:bg-zinc-900/30">
                    {form.icon ? (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                        <img src={form.icon} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setForm({...form, icon: ""})} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:scale-110 transition shadow-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 cursor-pointer relative">
                        {uploading ? (
                          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-green-600 mb-2 transition-colors" />
                            <span className="text-xs font-bold text-zinc-500">Upload Category Image</span>
                          </>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" disabled={uploading} />
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={creating || uploading || !form.title.trim()} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-95">
                  {creating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" size={18} />}
                  Save Specialty
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List Table */}
          <Card className="xl:col-span-7 border-none shadow-2xl bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[2.5rem] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <div className="h-2 w-2 bg-zinc-900 dark:bg-white rounded-full" />
                Active Specialties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white/30 dark:bg-black/20">
                <Table>
                  <TableHeader className="bg-zinc-100/50 dark:bg-zinc-900/50">
                    <TableRow className="border-zinc-200 dark:border-zinc-800">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest w-[80px] text-center">Icon</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Entry Details</TableHead>
                      <TableHead className="text-right pr-6 text-[10px] font-black uppercase tracking-widest">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" /></TableCell></TableRow>
                    ) : (
                      specialties.map((s) => (
                        <TableRow key={s.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-white/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <TableCell className="p-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner bg-zinc-100 dark:bg-zinc-900">
                              {s.icon ? <img src={s.icon} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-zinc-400" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{s.title}</h3>
                            <p className="text-[10px] text-zinc-500 font-medium line-clamp-1">{s.description || "No description provided."}</p>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="dark:bg-zinc-950 dark:border-zinc-800 rounded-[2rem]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-black uppercase">Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription className="text-xs font-bold text-zinc-500">
                                    Are you sure you want to remove <span className="text-red-500">{s.title}</span>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                  <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(s.id, s.title)} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold uppercase text-[10px]">Delete Forever</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}