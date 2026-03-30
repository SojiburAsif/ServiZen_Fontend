"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { 
  CloudUpload, 
  Loader2, 
  X, 
  Check, 
  Banknote, 
  Clock, 
  Tag 
} from "lucide-react";

import { createServiceServerAction } from "@/services/services.service";
import type { ProviderSpecialtyItem } from "@/services/provider.service";
import {
  ServicesValidation,
  type CreateServiceFormInput,
} from "@/zod/services.validation";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { extractApiErrorMessage } from "@/lib/httpError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateServiceFormProps = {
  specialties: ProviderSpecialtyItem[];
};

const sanitizeText = (value?: string | null) => value?.trim() || undefined;

export const CreateServiceForm = ({ specialties }: CreateServiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const specialtyOptions = useMemo(
    () =>
      specialties
        .map((item) => item.specialty)
        .filter((sp): sp is NonNullable<typeof sp> => Boolean(sp?.id))
        .map((sp) => ({
          id: sp.id,
          title: sp.title ?? "Untitled Specialty",
        })),
    [specialties],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateServiceFormInput>({
    resolver: zodResolver(ServicesValidation.createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: "",
      specialtyId: specialtyOptions[0]?.id ?? "",
      imageUrl: "",
    },
  });

  const requiresSpecialty = specialtyOptions.length === 0;
  const imageUrlValue = watch("imageUrl") ?? "";

  const onSubmit = async (values: CreateServiceFormInput) => {
    if (requiresSpecialty) {
      toast.error("Add a specialty to your profile first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsed = ServicesValidation.createServiceSchema.parse(values);
      const payload = {
        ...parsed,
        duration: sanitizeText(parsed.duration),
        specialtyId: sanitizeText(parsed.specialtyId),
        imageUrl: sanitizeText(parsed.imageUrl),
      };

      const response = await createServiceServerAction(payload);
      if (response.success && response.data) {
        toast.success(response.message || "Service published!");
        reset();
        router.refresh();
      } else {
        toast.error(response.message || "Failed to create service");
      }
    } catch (error) {
      toast.error("Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);
    try {
      const uploadedUrl = await uploadToImgbb(file);
      setValue("imageUrl", uploadedUrl, { shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white font-sans selection:bg-green-300">
      
      {/* Noise Filter Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-6">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Create New Service</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-medium">Publish your expertise and grow your business on ServZEN.</p>
        </div>

        {/* Main Glass Form Container */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-2xl shadow-green-900/10 space-y-10"
        >
          
          {/* Media Upload Section */}
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Service Cover Image</Label>
            <div 
              onClick={() => imageInputRef.current?.click()}
              className={`relative h-72 w-full rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group
                ${imageUrlValue 
                  ? "border-green-500/50" 
                  : "border-zinc-300 dark:border-zinc-800 hover:border-green-500/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md"
                }`}
            >
              {imageUrlValue ? (
                <>
                  <img src={imageUrlValue} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <p className="text-white text-sm font-bold tracking-tight">Click to replace image</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setValue("imageUrl", ""); }}
                    className="absolute top-6 right-6 p-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-red-500 transition-all border border-white/20"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4 p-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20 group-hover:scale-110 transition-transform">
                    {isImageUploading ? (
                      <Loader2 className="w-10 h-10 text-green-600 dark:text-green-400 animate-spin" />
                    ) : (
                      <CloudUpload className="w-10 h-10 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Drop your cover here</p>
                    <p className="text-xs text-zinc-500 font-medium mt-1">PNG, JPG or WebP (High quality recommended)</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
          </div>

          {/* Form Fields Section */}
          <div className="grid gap-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Service Title</Label>
              <Input 
                id="name"
                placeholder="Enter Your Service Title" 
                className="h-14 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-none shadow-inner focus-visible:ring-2 focus-visible:ring-green-500 text-lg font-bold"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("name")} 
              />
              {errors.name && <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight pl-2">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Detailed Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe your service in detail, including what customers can expect and any special features." 
                rows={5}
                className="rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-none shadow-inner focus-visible:ring-2 focus-visible:ring-green-500 resize-none py-4 text-md font-medium"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("description")} 
              />
              {errors.description && <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight pl-2">{errors.description.message}</p>}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Banknote size={16} className="text-green-600" /> Price (BDT)
              </Label>
              <Input 
                type="number"
                placeholder="0"
                className="h-14 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-none shadow-inner focus-visible:ring-2 focus-visible:ring-green-500 font-black text-xl text-green-700 dark:text-green-400"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("price", { valueAsNumber: true })} 
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Clock size={16} className="text-green-600" /> Duration
              </Label>
              <Input 
                placeholder="e.g. 30 mins, 1 hour" 
                className="h-14 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-none shadow-inner focus-visible:ring-2 focus-visible:ring-green-500 font-bold"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("duration")} 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Tag size={16} className="text-green-600" /> Specialty
              </Label>
              <Controller
                name="specialtyId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || requiresSpecialty}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-none shadow-inner focus:ring-2 focus:ring-green-500 font-bold">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[1.5rem] border-none shadow-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl">
                      {specialtyOptions.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="rounded-xl focus:bg-green-500 focus:text-white transition-colors py-3">
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Final Action Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting || requiresSpecialty || !isDirty}
              className="w-full h-16 rounded-[1.5rem] bg-zinc-900 dark:bg-green-600 dark:hover:bg-green-700 text-white font-black text-xl tracking-tight transition-all shadow-2xl shadow-green-500/20 active:scale-[0.97] hover:shadow-green-500/40 group disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <div className="flex items-center gap-3">
                  <span>Publish to Marketplace</span>
                  <Check size={24} className="group-hover:scale-125 transition-transform" />
                </div>
              )}
            </Button>
            <p className="text-center text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-6 uppercase tracking-widest">
              Secured & Verified by ServZEN Provider Protocol
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};