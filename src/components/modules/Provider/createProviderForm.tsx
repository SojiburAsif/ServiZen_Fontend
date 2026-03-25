/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createProviderAction } from "@/services/auth.service";
import

"lucide-react";
import { Button } from "@/components/ui/button";
import { AuthValidation } from "@/zod/auth.validation";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { toast } from "sonner";
import { Briefcase, Check, Loader2, Lock, Mail, MapPin, Upload, User } from "lucide-react";

// Zod logic theke type generate kora
type TProviderValues = z.infer<typeof AuthValidation.createProviderValidationSchema>;

export const CreateProviderForm = ({ specialties = [] }: { specialties: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TProviderValues>({
    resolver: zodResolver(AuthValidation.createProviderValidationSchema),
    defaultValues: {
      specialties: [],
      profilePhoto: "", 
    },
  });

  const profilePhotoUrl = watch("profilePhoto");
  const selectedSpecialties = watch("specialties");

  // --- IMAGE UPLOAD HANDLER FIX ---
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large! Max 2MB.");
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo to ImgBB...");

    try {
      // Tomar uploadToImgbb utility function call kora holo
      const url = await uploadToImgbb(file);
      
      // Zod schema-te URL-ta set kora holo
      setValue("profilePhoto", url, { shouldValidate: true });
      
      toast.success("Photo uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Photo upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: TProviderValues) => {
    setLoading(true);
    try {
      // Backend action call (Backend-e Admin role verify kora thakbe)
      const res = await createProviderAction(values);
      
      if (res.success) {
        toast.success("Provider account created successfully!");
        // Form reset korte chaile: reset();
      } else {
        toast.error(res.message || "Failed to create provider");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-500/5 dark:border-emerald-900/20 dark:bg-slate-900 md:p-10"
    >
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center justify-center space-y-4 border-b border-emerald-50 pb-8 dark:border-emerald-900/20">
        <div className="relative group">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-emerald-100 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10 flex items-center justify-center">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-emerald-500">
                {isUploading ? <Loader2 className="h-10 w-10 animate-spin" /> : <User size={48} />}
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-emerald-600 p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
            <Upload size={18} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              disabled={isUploading} 
            />
          </label>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Provider Profile Photo</p>
          {errors.profilePhoto && <p className="text-xs font-medium text-red-500 mt-1">{errors.profilePhoto.message}</p>}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Side: Account Info */}
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
            <Mail size={20} /> Account Information
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Full Name</label>
            <input 
              {...register("name")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800" 
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email Address</label>
            <input 
              {...register("email")}
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800" 
              placeholder="provider@servzen.com"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input 
                {...register("password")}
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800" 
                placeholder="••••••••"
              />
              <Lock className="absolute right-3 top-3 text-slate-400" size={18} />
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        {/* Right Side: Professional Details */}
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
            <Briefcase size={20} /> Professional Details
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Registration Number</label>
            <input 
              {...register("registrationNumber")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800" 
              placeholder="REG-123456"
            />
            {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Specialties</label>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-emerald-50 bg-emerald-50/20 p-4 dark:border-emerald-900/10 max-h-32 overflow-y-auto">
              {specialties.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    value={s.id}
                    checked={selectedSpecialties.includes(s.id)}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = selectedSpecialties.includes(val)
                        ? selectedSpecialties.filter((i: string) => i !== val)
                        : [...selectedSpecialties, val];
                      setValue("specialties", next, { shouldValidate: true });
                    }}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-600 transition-all"
                  />
                  <span className="text-slate-600 dark:text-slate-300">{s.title}</span>
                </label>
              ))}
            </div>
            {errors.specialties && <p className="text-xs text-red-500">{errors.specialties.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Contact Number</label>
            <input 
              {...register("contactNumber")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800" 
              placeholder="017XXXXXXXX"
            />
            {errors.contactNumber && <p className="text-xs text-red-500">{errors.contactNumber.message}</p>}
          </div>
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="grid gap-8 md:grid-cols-2 border-t border-emerald-50 pt-8 dark:border-emerald-900/20">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <MapPin size={16} className="text-emerald-600" /> Office Address
          </label>
          <textarea 
            {...register("address")}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800"
            placeholder="Complete address of the service provider..."
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Professional Bio</label>
          <textarea 
            {...register("bio")}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800"
            placeholder="Tell clients about the provider's expertise..."
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading || isUploading}
          className="w-full rounded-xl bg-emerald-600 py-7 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-400"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Create Provider Account
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};