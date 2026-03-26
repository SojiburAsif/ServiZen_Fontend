"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { 
  CloudUpload, 
  Loader2, 
  Plus, 
  X, 
  Check, 
  Banknote, 
  Clock, 
  Tag 
} from "lucide-react";

import { createService } from "@/services/services.service";
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

      const response = await createService(payload);
      toast.success(response?.message || "Service published!");
      reset();
      router.refresh();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to create service"));
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto py-16 px-6">
        
        {/* Simple Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Create New Service</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Publish your expertise and start receiving bookings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section: Media */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Service Cover Image</Label>
            <div 
              onClick={() => imageInputRef.current?.click()}
              className={`relative h-64 w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                ${imageUrlValue 
                  ? "border-emerald-500/50" 
                  : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 bg-zinc-50/50 dark:bg-zinc-900/50"
                }`}
            >
              {imageUrlValue ? (
                <>
                  <img src={imageUrlValue} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Click to change image</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setValue("imageUrl", ""); }}
                    className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4 p-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                    {isImageUploading ? (
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    ) : (
                      <CloudUpload className="w-8 h-8 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Click to upload cover</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG or WebP (Max 2MB)</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
          </div>

          {/* Section: Basic Info */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Service Name</Label>
              <Input 
                id="name"
                placeholder="e.g. Professional AC Maintenance" 
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("name")} 
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Detailed Description</Label>
              <Textarea 
                id="description"
                placeholder="What is included in this service?" 
                rows={4}
                className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("description")} 
              />
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>
          </div>

          {/* Section: Numbers & Category */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Banknote size={14} className="text-emerald-500" /> Price (BDT)
              </Label>
              <Input 
                type="number"
                placeholder="0"
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-emerald-500 font-semibold"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("price", { valueAsNumber: true })} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Clock size={14} className="text-emerald-500" /> Duration
              </Label>
              <Input 
                placeholder="e.g. 1.5 hrs" 
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                disabled={isSubmitting || requiresSpecialty} 
                {...register("duration")} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Tag size={14} className="text-emerald-500" /> Specialty
              </Label>
              <Controller
                name="specialtyId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || requiresSpecialty}>
                    <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-none focus:ring-1 focus:ring-emerald-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl bg-white dark:bg-zinc-900">
                      {specialtyOptions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting || requiresSpecialty || !isDirty}
              className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-lg transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2">
                  <span>Publish Service</span>
                  <Check size={20} />
                </div>
              )}
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">You can always edit or pause this service later.</p>
          </div>
        </form>
      </div>
    </div>
  );
};