"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon, Clock, Tag, DollarSign, Eye } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractApiErrorMessage } from "@/lib/httpError";
import {
  ServicesValidation,
  type UpdateServiceFormInput,
} from "@/zod/services.validation";
import { updateService, type ServiceRecord } from "@/services/services.service";

const sanitize = (value?: string | null) => value?.trim() || undefined;

type SpecialtyOption = { id: string; title: string };

type ServiceEditorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceRecord | null;
  specialtyOptions?: SpecialtyOption[];
  onUpdated: (service: ServiceRecord) => void;
};

export const ServiceEditorSheet = ({
  open,
  onOpenChange,
  service,
  specialtyOptions = [],
  onUpdated,
}: ServiceEditorSheetProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateServiceFormInput>({
    resolver: zodResolver(ServicesValidation.updateServiceSchema),
    defaultValues: {
      name: service?.name,
      description: service?.description,
      price: service?.price,
      duration: service?.duration ?? "",
      specialtyId: service?.specialtyId ?? undefined,
      isActive: service?.isActive,
      imageUrl: service?.imageUrl ?? "",
    },
  });

  const imagePreview = watch("imageUrl") ?? "";

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration ?? "",
        specialtyId: service.specialtyId ?? undefined,
        isActive: service.isActive,
        imageUrl: service.imageUrl ?? "",
      });
    }
  }, [service, reset]);

  const onSubmit = async (values: UpdateServiceFormInput) => {
    if (!service) return;
    try {
      const parsed = ServicesValidation.updateServiceSchema.parse(values);
      const payload = {
        ...parsed,
        name: sanitize(parsed.name),
        description: sanitize(parsed.description),
        duration: sanitize(parsed.duration),
        specialtyId: sanitize(parsed.specialtyId),
        imageUrl: sanitize(parsed.imageUrl),
      };

      const response = await updateService(service.id, payload);
      onUpdated(response.data);
      toast.success("Service updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to update service"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl p-0 border-l border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col h-full">
          {/* --- Header Section --- */}
          <SheetHeader className="p-8 pb-4 border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                Edit Service
              </SheetTitle>
              <SheetDescription className="text-zinc-500 font-medium">
                {service ? `Refining details for "${service.name}"` : "Update your service information."}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* --- Form Section --- */}
          <form className="flex-1 overflow-y-auto p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Basic Info Group */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-xs uppercase font-bold tracking-widest text-zinc-400">Service Title</Label>
                <Input 
                  id="edit-name" 
                  className="h-12 rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-emerald-500" 
                  placeholder="e.g., Professional Web Development" 
                  disabled={isSubmitting} 
                  {...register("name")} 
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-xs uppercase font-bold tracking-widest text-zinc-400">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  className="rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-emerald-500 resize-none"
                  placeholder="What does this service offer?"
                  disabled={isSubmitting}
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>
            </div>

            {/* Price & Duration Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                  <DollarSign size={12} /> Price (BDT)
                </Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  className="h-11 rounded-xl border-zinc-100 dark:border-zinc-800" 
                  disabled={isSubmitting} 
                  {...register("price")} 
                />
                {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration" className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                  <Clock size={12} /> Duration
                </Label>
                <Input 
                  id="edit-duration" 
                  className="h-11 rounded-xl border-zinc-100 dark:border-zinc-800" 
                  placeholder="e.g., 2 hours" 
                  disabled={isSubmitting} 
                  {...register("duration")} 
                />
              </div>
            </div>

            {/* Category/Specialty */}
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                <Tag size={12} /> Specialty Category
              </Label>
              <Controller
                name="specialtyId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? "auto"} onValueChange={(value) => field.onChange(value)} disabled={isSubmitting || specialtyOptions.length === 0}>
                    <SelectTrigger className="h-11 rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="auto">Auto-assign (Default)</SelectItem>
                      {specialtyOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Visuals / Image */}
            <div className="space-y-4">
              <Label htmlFor="edit-image" className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2">
                <ImageIcon size={12} /> Cover Image URL
              </Label>
              <Input
                id="edit-image"
                type="url"
                className="h-11 rounded-xl border-zinc-100 dark:border-zinc-800"
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                {...register("imageUrl")}
              />
              <div className="relative group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-40 w-full rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800 shadow-sm" />
                ) : (
                  <div className="h-40 w-full rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50">
                    <ImageIcon size={32} className="opacity-20 mb-2" />
                    <span className="text-xs font-medium">No image preview available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 p-4 transition-all hover:bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                  <Eye size={18} />
                </div>
                <div>
                  <Label htmlFor="edit-active" className="text-sm font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer">
                    Live on Marketplace
                  </Label>
                  <p className="text-[11px] text-zinc-500 font-medium">Toggle visibility for customers</p>
                </div>
              </div>
              <Checkbox 
                id="edit-active" 
                checked={Boolean(watch("isActive"))} 
                onCheckedChange={(checked) => setValue("isActive", Boolean(checked))} 
                disabled={isSubmitting}
                className="h-5 w-5 rounded-md border-emerald-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
            </div>
          </form>

          {/* --- Footer Section --- */}
          <SheetFooter className="p-8 border-t border-zinc-50 dark:border-zinc-900 bg-zinc-50/30">
            <Button 
              type="submit" 
              onClick={handleSubmit(onSubmit)} 
              disabled={isSubmitting} 
              className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-zinc-900/10 dark:shadow-emerald-900/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </span>
              )}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};