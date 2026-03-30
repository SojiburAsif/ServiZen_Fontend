/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createAdmin } from '@/services/user.service';
import { uploadToImgbb } from '@/lib/imageUpload.utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  UploadCloud, 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';

const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  contactNumber: z.string().trim().min(11, "At least 11 digits").max(14, "At most 14 digits").optional().or(z.literal('')),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200, "Max 200 characters").optional().or(z.literal('')),
  profilePhoto: z.string().trim().url("Valid URL required").optional().or(z.literal('')),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

export default function CreateAdminFormPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "", email: "", password: "", contactNumber: "", address: "", profilePhoto: "",
    },
  });

  const onSubmit = async (data: CreateAdminFormValues) => {
    try {
      const payload = {
        ...data,
        contactNumber: data.contactNumber || undefined,
        address: data.address || undefined,
        profilePhoto: data.profilePhoto || undefined,
        role: "ADMIN" as const,
      };

      await createAdmin(payload);
      toast.success("New administrator onboarded successfully!");
      form.reset();
      router.push('/dashboard/admin/all-admins'); // Redirecting to list
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToImgbb(file);
      form.setValue("profilePhoto", url, { shouldValidate: true });
      toast.success("Profile photo uploaded!");
    } catch (error: any) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10 px-4"
    >
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
        
        {/* --- DECORATIVE HEADER --- */}
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600" />
        
        <CardHeader className="p-8 md:p-12 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <UserPlus className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                Onboard <span className="text-green-600 italic">Admin</span>
              </CardTitle>
              <CardDescription className="text-gray-500 font-medium">
                Set up a new administrative account with system-wide access.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 md:p-12 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* --- SECTION 1: IDENTITY --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-[11px] tracking-widest text-gray-400 ml-1">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Input placeholder="Enter full name" {...field} className="pl-11 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 ring-green-500/20" />
                           <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-[11px] tracking-widest text-gray-400 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="email" placeholder="Enter email address" {...field} className="pl-11 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 ring-green-500/20" />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-[11px] tracking-widest text-gray-400 ml-1">Secure Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-11 pr-11 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 ring-green-500/20" />
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-[11px] tracking-widest text-gray-400 ml-1">Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="01XXXXXXXXX" {...field} className="pl-11 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 ring-green-500/20" />
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- SECTION 2: LOCATION & PROFILE --- */}
              <div className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-[11px] tracking-widest text-gray-400 ml-1">Work/Home Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Enter detailed address" {...field} className="pl-11 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 ring-green-500/20" />
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 transition-all hover:border-green-500/50">
                   <div className="flex items-center gap-6">
                      <div className={`h-20 w-20 rounded-2xl overflow-hidden bg-white dark:bg-black shadow-inner flex items-center justify-center border-2 ${form.watch('profilePhoto') ? 'border-green-500' : 'border-gray-100 dark:border-white/5'}`}>
                        {form.watch('profilePhoto') ? (
                          <img src={form.watch('profilePhoto')} alt="Admin" className="h-full w-full object-cover" />
                        ) : (
                          <Sparkles className="size-8 text-gray-200 dark:text-gray-800" />
                        )}
                      </div>
                      
                      <div className="space-y-2 text-center md:text-left">
                        <input type="file" id="img-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        <label 
                          htmlFor="img-upload" 
                          className={`inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-black cursor-pointer hover:scale-105 transition-all shadow-xl shadow-black/10 ${isUploading && 'opacity-50'}`}
                        >
                          {isUploading ? <Loader2 className="size-4 animate-spin mr-2" /> : <UploadCloud className="size-4 mr-2" />}
                          {form.watch('profilePhoto') ? "Change Image" : "Upload Profile Photo"}
                        </label>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">JPG, PNG OR WEBP. MAX 2MB.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* --- FOOTER ACTIONS --- */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5 gap-4">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="text-sm font-black text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Discard Changes
                </button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting || isUploading}
                  className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-2xl shadow-green-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2 italic">
                      <Loader2 className="size-5 animate-spin" /> Initializing...
                    </div>
                  ) : (
                    "Confirm & Create"
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}