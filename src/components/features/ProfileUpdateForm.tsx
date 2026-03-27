/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User, Mail, Phone, MapPin, Camera,
    Loader2, CheckCircle2, Circle, Sparkles,
    ArrowRight, ShieldCheck, Upload, X
} from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile, UpdateProfileData } from "@/services/user.service";
import { Progress } from "@/components/ui/progress";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

interface ProfileUpdateFormProps {
    initialData: {
        name?: string;
        email?: string;
        contactNumber?: string;
        address?: string;
        image?: string;
    };
    onSuccess?: () => void;
}

export function ProfileUpdateForm({ initialData, onSuccess }: ProfileUpdateFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(initialData.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<UpdateProfileData>({
        name: initialData.name || "",
        profilePhoto: initialData.image || "",
        contactNumber: initialData.contactNumber || "",
        address: initialData.address || "",
    });

    const fields = [
        { key: 'name', label: 'Full Name', value: initialData.name, icon: User },
        { key: 'image', label: 'Photo', value: previewImage, icon: Camera },
        { key: 'contactNumber', label: 'Phone', value: initialData.contactNumber, icon: Phone },
        { key: 'address', label: 'Address', value: initialData.address, icon: MapPin },
    ];

    const completedFields = fields.filter(f => f.value).length;
    const progressPercentage = (completedFields / 4) * 100;

    const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const imageUrl = await uploadToImgbb(file);
            setPreviewImage(imageUrl);
            handleInputChange("profilePhoto", imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        handleInputChange("profilePhoto", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updateData: UpdateProfileData = {};
            if (formData.name?.trim()) updateData.name = formData.name.trim();
            if (formData.profilePhoto?.trim()) updateData.profilePhoto = formData.profilePhoto.trim();
            if (formData.contactNumber?.trim()) updateData.contactNumber = formData.contactNumber.trim();
            if (formData.address?.trim()) updateData.address = formData.address.trim();

            if (Object.keys(updateData).length === 0) {
                toast.error("Please change at least one field");
                setIsSubmitting(false);
                return;
            }

            await updateUserProfile(updateData);
            toast.success("Profile updated successfully!");
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            {/* modern Progress Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-sm">
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="size-5 text-emerald-500" />
                                Profile Strength
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {completedFields === 4 ? "Your profile is fully optimized!" : "Complete your profile to build trust."}
                            </p>
                        </div>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        {fields.map((field) => (
                            <div key={field.key} className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-950/30 rounded-lg border border-white/50 dark:border-slate-700/50">
                                {field.value ? (
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle className="size-4 text-slate-300 dark:text-slate-600 shrink-0" />
                                )}
                                <span className={`text-[11px] font-medium truncate ${field.value ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                    {field.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Input Sections */}
            <div className="grid gap-6">
                {/* Name Field */}
                <div className="group space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ml-1">
                        <User className="size-4 text-emerald-500" />
                        Full Name
                    </Label>
                    <div className="relative">
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Ex: Sojibur Rahman Asif"
                            className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Photo Upload Field */}
                <div className="group space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ml-1">
                        <Camera className="size-4 text-emerald-500" />
                        Profile Photo
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Image Preview */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="size-8 text-slate-400" />
                                )}
                            </div>
                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full sm:w-auto h-12 px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 size-4" />
                                        Choose Image
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-slate-500 mt-2">
                                PNG, JPG up to 5MB
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Contact Field */}
                    <div className="group space-y-2">
                        <Label htmlFor="contactNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ml-1">
                            <Phone className="size-4 text-emerald-500" />
                            Phone Number
                        </Label>
                        <Input
                            id="contactNumber"
                            type="tel"
                            value={formData.contactNumber}
                            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                            placeholder="+880"
                            className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 focus-visible:ring-emerald-500/20 transition-all duration-200"
                        />
                    </div>

                    {/* Security Badge */}
                    <div className="hidden sm:flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <ShieldCheck className="size-8 text-emerald-500/50" />
                        <p className="text-[11px] text-slate-500 leading-tight">
                            Your information is encrypted and stored securely in our database.
                        </p>
                    </div>
                </div>

                {/* Address Field */}
                <div className="group space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 ml-1">
                        <MapPin className="size-4 text-emerald-500" />
                        Current Address
                    </Label>
                    <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="House no, Road, City, Country"
                        rows={3}
                        className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus-visible:ring-emerald-500/20 transition-all duration-200 resize-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] group"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 size-5 animate-spin" />
                            Syncing Data...
                        </>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            Update My Profile
                            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}