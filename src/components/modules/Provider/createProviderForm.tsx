/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createProviderAction } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { AuthValidation } from "@/zod/auth.validation";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { toast } from "sonner";
import {
  Check,
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

  const onSubmit = async (values: TProviderValues) => {
    setLoading(true);
    const toastId = toast.loading("Creating provider account...");
    
    try {
      const res = await createProviderAction(values as Record<string, any>);
      
      if (res?.success) {
        toast.success("✅ Provider account created successfully!", { id: toastId });
        reset();
      } else {
        // Check for specific error messages
        let errorMessage = res?.message || "Failed to create provider account.";
        
        // Handle "Provider creation failed: Request failed with status code 500"
        if (errorMessage.includes("Provider creation failed: Request failed with status code 500")) {
          errorMessage = "Email already exists! Please use a different email address.";
        }
        
        toast.error(errorMessage, { id: toastId });
      }
    } catch (err: any) {
      // 500 error holeo jodi backend specific message pathay (e.g. Email already exists)
      const backendError = err?.response?.data?.message || err?.response?.data?.error;
      const backendErrorMessage = err?.response?.data?.errorSources?.[0]?.message;
      
      let finalErrorMessage = "Something went wrong on the server.";

      // Check for email already exists in various backend response formats
      const hasEmailExistsError = 
        (backendError && (backendError.toLowerCase().includes("email already exists") || 
                         backendError.toLowerCase().includes("user email already exists"))) ||
        (backendErrorMessage && (backendErrorMessage.toLowerCase().includes("email already exists") || 
                                backendErrorMessage.toLowerCase().includes("user email already exists")));

      if (hasEmailExistsError) {
        finalErrorMessage = "Email already exists! Please use a different email address.";
      } else if (backendError) {
        finalErrorMessage = backendError;
      } else if (err.message && err.message.includes("Request failed with status code 500")) {
        // If it's a generic 500 error, assume it might be email exists
        finalErrorMessage = "Email already exists! Please use a different email address.";
      } else if (err.message.includes("500")) {
        // Jodi specific message na thake kintu status 500 hoy
        finalErrorMessage = "Internal Server Error (500). Please check if the email already exists.";
      } else {
        finalErrorMessage = err.message;
      }

      toast.error(`❌ ${finalErrorMessage}`, { id: toastId });
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };
  // Reusable Classes
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-500";
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-emerald-50/80 mb-1.5";
  const errorClass = "mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-500 uppercase tracking-tight";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl dark:border-emerald-500/10 dark:bg-slate-900/80 dark:shadow-black/50"
    >
      <div className="p-6 md:p-8 space-y-10">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="group relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl transition-transform group-hover:scale-105 dark:border-slate-800 dark:bg-slate-800">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              ) : profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <User size={40} className="text-emerald-200 dark:text-emerald-900" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full border-2 border-white bg-emerald-600 p-2.5 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-500 active:scale-90 dark:border-slate-900">
              <Upload size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} />
            </label>
          </div>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-emerald-400">Profile Photo</p>
            {errors.profilePhoto && <p className={errorClass}>{errors.profilePhoto.message}</p>}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200 dark:bg-emerald-900/30" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Credentials</h3>
            <span className="h-px flex-1 bg-slate-200 dark:bg-emerald-900/30" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("name")} className={`${inputClass} pl-11`} placeholder="Enter full name" />
              </div>
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("email")} type="email" className={`${inputClass} pl-11`} placeholder="Enter email address" />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("password")} type={showPassword ? "text" : "password"} className={`${inputClass} pl-11 pr-11`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} className={`${inputClass} pl-11 pr-11`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200 dark:bg-emerald-900/30" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Work Details</h3>
            <span className="h-px flex-1 bg-slate-200 dark:bg-emerald-900/30" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Registration No.</label>
              <div className="relative">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("registrationNumber")} className={`${inputClass} pl-11`} placeholder="REG-2026-XXXX" />
              </div>
              {errors.registrationNumber && <p className={errorClass}>{errors.registrationNumber.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Years Experience</label>
              <div className="relative">
                <Star size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("experience")} type="number" className={`${inputClass} pl-11`} placeholder="Enter years of experience" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("contactNumber")} className={`${inputClass} pl-11`} placeholder="Enter phone number" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60" />
                <input {...register("address")} className={`${inputClass} pl-11`} placeholder="Enter location" />
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Select Specialties</label>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/50 bg-white/40 p-4 dark:border-slate-700/50 dark:bg-slate-800/30">
            {specialties.length === 0 ? (
               <p className="text-sm text-slate-500 w-full text-center py-2 font-medium">No specialties available.</p>
            ) : (
              specialties.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSpecialty(s.id)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                    selectedSpecialties.includes(s.id)
                      ? "scale-105 border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {selectedSpecialties.includes(s.id) && <Check size={12} className="mr-1.5 inline" />}
                  {s.title}
                </button>
              ))
            )}
          </div>
          {errors.specialties && <p className={errorClass}>{errors.specialties.message as string}</p>}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={loading || isUploading}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-7 text-base font-black uppercase tracking-widest text-white transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
            {loading ? "Processing..." : "Create Account"}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </Button>
      </div>
    </form>
  );
};