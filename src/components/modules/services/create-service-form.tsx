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
    <div className="mx-auto max-w-4xl mt-3">
      {/* Main Form Container */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-10 rounded-[2.5rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 md:p-12"
      >
        
        {/* Media Upload Section */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Service Cover Image</Label>
          <div 
            onClick={() => imageInputRef.current?.click()}
            className={`group relative flex h-72 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed transition-all
              ${imageUrlValue 
                ? "border-emerald-500/50" 
                : "border-zinc-100 bg-zinc-50/50 hover:border-emerald-500/30 dark:border-zinc-900 dark:bg-zinc-900/30 dark:hover:border-emerald-500/20"
              }`}
          >
            {imageUrlValue ? (
              <>
                <img src={imageUrlValue} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-bold tracking-tight text-white">Click to replace image</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue("imageUrl", ""); }}
                  className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/20 p-2.5 text-white backdrop-blur-xl transition-all hover:bg-rose-500"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl transition-transform group-hover:scale-110 dark:bg-zinc-900">
                  {isImageUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                  ) : (
                    <CloudUpload className="h-10 w-10 text-emerald-500" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Drop your cover here</p>
                  <p className="mt-1 text-xs font-medium text-zinc-400">PNG, JPG or WebP (High quality recommended)</p>
                </div>
              </div>
            )}
          </div>
          <input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
        </div>

        {/* Form Fields Section */}
        <div className="grid gap-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Service Title</Label>
            <Input 
              id="name"
              placeholder="Enter Your Service Title" 
              className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 text-lg font-bold transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50"
              disabled={isSubmitting || requiresSpecialty} 
              {...register("name")} 
            />
            {errors.name && <p className="pl-2 text-[11px] font-bold uppercase tracking-tight text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Detailed Description</Label>
            <Textarea 
              id="description"
              placeholder="Describe your service in detail..." 
              rows={5}
              className="resize-none rounded-2xl border-zinc-100 bg-zinc-50/50 py-4 text-md font-medium transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50"
              disabled={isSubmitting || requiresSpecialty} 
              {...register("description")} 
            />
            {errors.description && <p className="pl-2 text-[11px] font-bold uppercase tracking-tight text-rose-500">{errors.description.message}</p>}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Banknote size={14} className="text-emerald-500" /> Price (BDT)
            </Label>
            <Input 
              type="number"
              placeholder="0"
              className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 text-xl font-black text-emerald-600 transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-emerald-400"
              disabled={isSubmitting || requiresSpecialty} 
              {...register("price", { valueAsNumber: true })} 
            />
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Clock size={14} className="text-emerald-500" /> Duration
            </Label>
            <Input 
              placeholder="e.g. 30 mins" 
              className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50"
              disabled={isSubmitting || requiresSpecialty} 
              {...register("duration")} 
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              <Tag size={14} className="text-emerald-500" /> Specialty
            </Label>
            <Controller
              name="specialtyId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || requiresSpecialty}>
                  <SelectTrigger className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold transition-all focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-100 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    {specialtyOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="cursor-pointer rounded-xl py-3 font-bold transition-colors focus:bg-emerald-500 focus:text-white">
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
            className="h-16 w-full rounded-2xl bg-emerald-500 text-xl font-black tracking-tight text-white shadow-2xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-3">
                <span>Publish Service</span>
                <Check size={20} />
              </div>
            )}
          </Button>
          <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Authenticated via ServZEN Protocol
          </p>
        </div>
      </form>
    </div>
  );
};