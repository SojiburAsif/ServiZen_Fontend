"use client";

import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, RefreshCw, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProviderSelfProfile } from "@/services/provider.service";
import { updateProviderProfileServerAction, type UpdateProviderProfilePayload } from "@/services/provider.client";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .or(z.literal(""));

const providerProfileSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80, "Name is too long"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  contactNumber: optionalText(20, "Too many characters"),
  address: optionalText(160, "Address is too long"),
  registrationNumber: optionalText(60, "Registration no. too long"),
  experience: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => value === undefined || value === "" || /^\d+(\.\d+)?$/.test(value), {
      message: "Enter a valid number",
    }),
  bio: optionalText(500, "Bio is too long"),
  profilePhoto: z.string().url("Provide a valid image URL").optional().or(z.literal("")),
});

type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

const toNullable = (value?: string | null) => (value && value.trim().length > 0 ? value.trim() : null);

const toNumeric = (value?: string | null) => {
  if (!value || value.trim() === "") return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value.trim() : numeric;
};

export const ProviderProfileForm = ({ initialData }: { initialData: ProviderSelfProfile }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const initialValues = useMemo<ProviderProfileFormValues>(
    () => ({
      name: initialData.name || initialData.user?.name || "",
      email: initialData.email || initialData.user?.email || "",
      contactNumber: initialData.contactNumber || "",
      address: initialData.address || "",
      registrationNumber: initialData.registrationNumber || "",
      experience: initialData.experience ? String(initialData.experience) : "",
      bio: initialData.bio || "",
      profilePhoto: initialData.profilePhoto || "",
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const profilePhotoValue = watch("profilePhoto");
  const nameValue = watch("name");

  const handleUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be under 2MB");
        return;
      }
      setIsUploading(true);
      const toastId = toast.loading("Uploading photo...");
      try {
        const url = await uploadToImgbb(file);
        setValue("profilePhoto", url, { shouldDirty: true, shouldTouch: true });
        toast.success("Photo uploaded", { id: toastId });
      } catch {
        toast.error("Photo upload failed", { id: toastId });
      } finally {
        event.target.value = "";
        setIsUploading(false);
      }
    },
    [setValue],
  );

  const onSubmit = async (values: ProviderProfileFormValues) => {
    setIsSubmitting(true);
    const payload: UpdateProviderProfilePayload = {
      name: values.name.trim(),
      contactNumber: toNullable(values.contactNumber),
      address: toNullable(values.address),
      registrationNumber: toNullable(values.registrationNumber),
      experience: toNumeric(values.experience),
      bio: toNullable(values.bio),
      profilePhoto: toNullable(values.profilePhoto),
    };

    // Remove null/undefined values to avoid sending them to backend
    Object.keys(payload).forEach(key => {
      if (payload[key as keyof UpdateProviderProfilePayload] === null || 
          payload[key as keyof UpdateProviderProfilePayload] === undefined) {
        delete payload[key as keyof UpdateProviderProfilePayload];
      }
    });

    const toastId = toast.loading("Saving profile...");

    try {
      const response = await updateProviderProfileServerAction(payload);

      if (!response?.success) {
        throw new Error((response as { message: string }).message || "Failed to update profile");
      }
      toast.success("Profile updated successfully", { id: toastId });
      reset({ ...values, name: values.name.trim() });
      router.refresh();
    } catch (error: unknown) {
      const fallbackMessage = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(fallbackMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => reset(initialValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0 rounded-full border-4 border-white bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-800">
          {profilePhotoValue ? (
            <Image src={profilePhotoValue} alt="Profile preview" fill sizes="112px" className="rounded-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-50 text-3xl font-black text-emerald-500 dark:bg-emerald-950/40">
              {(nameValue || initialValues.name || "P").charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center">
          <input type="file" accept="image/*" className="hidden" id="provider-photo-upload" onChange={handleUpload} disabled={isUploading} />
          <Button asChild disabled={isUploading} variant="secondary" className="rounded-full">
            <label htmlFor="provider-photo-upload" className="flex cursor-pointer items-center gap-2">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? "Uploading..." : "Upload Photo"}
            </label>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue("profilePhoto", "", { shouldDirty: true, shouldTouch: true })}
            disabled={isUploading}
            className="text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Remove photo
          </Button>
        </div>
      </div>
      <input type="hidden" {...register("profilePhoto")} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="provider-name">Full name</Label>
          <Input id="provider-name" placeholder="e.g. Afsar Rahman" {...register("name")}
            className="rounded-2xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-email">Email address</Label>
          <Input id="provider-email" disabled {...register("email")}
            className="rounded-2xl border-white/50 bg-white/40 text-sm font-semibold opacity-70 dark:border-white/10 dark:bg-zinc-900/40" />
          {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-phone">Contact number</Label>
          <Input id="provider-phone" placeholder="8801XXXXXXXXX" {...register("contactNumber")}
            className="rounded-2xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.contactNumber && <p className="text-xs font-semibold text-red-500">{errors.contactNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-experience">Experience (years)</Label>
          <Input id="provider-experience" placeholder="5" {...register("experience")}
            className="rounded-2xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.experience && <p className="text-xs font-semibold text-red-500">{errors.experience.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="provider-address">Address</Label>
          <Input id="provider-address" placeholder="House 12, Road 3, Dhanmondi" {...register("address")}
            className="rounded-2xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.address && <p className="text-xs font-semibold text-red-500">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-registration">Registration number</Label>
          <Input id="provider-registration" placeholder="REG-2031" {...register("registrationNumber")}
            className="rounded-2xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.registrationNumber && <p className="text-xs font-semibold text-red-500">{errors.registrationNumber.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="provider-bio">Short bio</Label>
          <Textarea id="provider-bio" rows={4} placeholder="Tell your clients how you create impact" {...register("bio")}
            className="rounded-3xl border-white/50 bg-white/70 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900/60" />
          {errors.bio && <p className="text-xs font-semibold text-red-500">{errors.bio.message}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting || !isDirty} className="rounded-2xl bg-emerald-600 px-8 text-white hover:bg-emerald-500">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Save changes
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting} className="rounded-2xl border-emerald-200 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 hover:bg-emerald-50">
          Reset
        </Button>
      </div>
    </form>
  );
};
