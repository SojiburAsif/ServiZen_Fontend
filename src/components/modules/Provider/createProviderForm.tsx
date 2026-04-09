/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createProviderServerAction } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { AuthValidation } from "@/zod/auth.validation";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Upload,
  User,
} from "lucide-react";

type TProviderValues = z.infer<typeof AuthValidation.createProviderValidationSchema>;

export const CreateProviderForm = ({ specialties = [] }: { specialties: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TProviderValues>({
    resolver: zodResolver(AuthValidation.createProviderValidationSchema),
    defaultValues: {
      specialties: [],
      profilePhoto: "",
    },
  });

  const profilePhotoUrl = watch("profilePhoto");
  const selectedSpecialties = watch("specialties") ?? [];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large! Max 2MB.");
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const url = await uploadToImgbb(file);
      setValue("profilePhoto", url, { shouldValidate: true });
      toast.success("Photo uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Photo upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSpecialty = (id: string) => {
    const next = selectedSpecialties.includes(id)
      ? selectedSpecialties.filter((i: string) => i !== id)
      : [...selectedSpecialties, id];
    setValue("specialties", next, { shouldValidate: true });
  };

  const onFormSubmit = async (data: TProviderValues) => {
    setLoading(true);
    const toastId = toast.loading("Creating provider account...");

    try {
      const result = await createProviderServerAction(data);

      if (result?.success) {
        toast.success("✅ Provider account created successfully!", { id: toastId });
        reset();
      } else {
        let errorMessage = result?.message || "Failed to create provider account.";
        
        // Handle email already exists error
        if (errorMessage.toLowerCase().includes("email already exists") || 
            errorMessage.toLowerCase().includes("user email already exists")) {
          errorMessage = "Email already exists! Please use a different email address.";
        }
        
        // Make error message more user-friendly
        if (errorMessage.includes("Invalid input: expected array, received undefined")) {
          errorMessage = "Please select at least one specialty.";
        } else if (errorMessage.includes("specialties")) {
          errorMessage = "Please select at least one specialty to continue.";
        } else if (errorMessage.includes("Unable to connect to the server")) {
          errorMessage = "Server connection failed. Please check your internet and try again.";
        } else if (errorMessage.includes("Network error")) {
          errorMessage = "Network issue detected. Please try again.";
        }
        
        toast.error(errorMessage, { id: toastId });
      }
    } catch (error: any) {
      let finalErrorMessage = "Something went wrong on the server.";
      
      if (error?.message) {
        finalErrorMessage = error.message;
      }
      
      toast.error(`❌ ${finalErrorMessage}`, { id: toastId });
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // Reusable Classes
  const inputClass =
    "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm font-bold text-zinc-900 placeholder-zinc-400 transition-all focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:bg-zinc-900 dark:focus:ring-zinc-100/5";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 ml-1";
  const errorClass = "mt-2 flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest";

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-black dark:shadow-none"
    >
      <div className="p-8 md:p-12 space-y-12">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-5">
          <div className="group relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-zinc-100 bg-zinc-50 shadow-inner transition-transform group-hover:scale-[1.02] dark:border-zinc-900 dark:bg-zinc-900">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-zinc-900 dark:text-white" />
              ) : profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <User size={48} className="text-zinc-200 dark:text-zinc-800" />
              )}
            </div>
            <label className="absolute bottom-1 right-1 cursor-pointer rounded-full border-4 border-white bg-zinc-900 p-3 text-white shadow-xl transition-all hover:scale-110 active:scale-95 dark:border-black dark:bg-white dark:text-black">
              <Upload size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} />
            </label>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Display Identity</p>
            {errors.profilePhoto && <p className={errorClass}><AlertCircle size={12}/>{errors.profilePhoto.message}</p>}
          </div>
        </div>

        {/* Form Groups */}
        <div className="space-y-10">
          {/* Credentials */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">01. Credentials</h3>
              <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Legal Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("name")} className={`${inputClass} pl-12`} placeholder="Ex: John Doe" />
                </div>
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>System Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("email")} type="email" className={`${inputClass} pl-12`} placeholder="john@example.com" />
                </div>
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Access Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("password")} type={showPassword ? "text" : "password"} className={`${inputClass} pl-12 pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Confirm Access</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} className={`${inputClass} pl-12 pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">02. Work Details</h3>
              <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Govt. Registration</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("registrationNumber")} className={`${inputClass} pl-12`} placeholder="REG-2026-XXXX" />
                </div>
                {errors.registrationNumber && <p className={errorClass}>{errors.registrationNumber.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Experience (Years)</label>
                <div className="relative">
                  <Star size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("experience")} type="number" className={`${inputClass} pl-12`} placeholder="0" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Direct Contact</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("contactNumber")} className={`${inputClass} pl-12`} placeholder="+880" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Base Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input {...register("address")} className={`${inputClass} pl-12`} placeholder="City, Area" />
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">03. Domain expertise</h3>
              <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
            </div>

            <div className="flex flex-wrap gap-2.5 rounded-3xl border border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-900 dark:bg-zinc-900/20">
              {specialties.length === 0 ? (
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 w-full text-center py-4">Status: No specialties found</p>
              ) : (
                specialties.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSpecialty(s.id)}
                    className={`rounded-2xl border px-4 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all ${
                      selectedSpecialties.includes(s.id)
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg dark:border-zinc-100 dark:bg-white dark:text-black"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                    }`}
                  >
                    {selectedSpecialties.includes(s.id) && <Check size={12} className="mr-2 inline" />}
                    {s.title}
                  </button>
                ))
              )}
            </div>
            {errors.specialties && <p className={errorClass}><AlertCircle size={12}/>{errors.specialties.message as string}</p>}
            
            {/* Hidden inputs */}
            {selectedSpecialties.map((specialtyId) => (
              <input key={specialtyId} type="hidden" name="specialties" value={specialtyId} />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={loading || isUploading}
          className="group relative w-full overflow-hidden rounded-[2rem] bg-zinc-900 py-8 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:shadow-white/10"
        >
          <span className="relative z-10 flex items-center justify-center gap-4">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
            {loading ? "Authorizing..." : "Register Provider Account"}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-black/5" />
        </Button>
      </div>
    </form>
  );
};