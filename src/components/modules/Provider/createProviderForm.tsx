"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProviderAction } from "@/services/auth.service";

interface Specialty {
  id: string;
  name: string;
}

interface ProviderFormProps {
  specialties?: Specialty[];
}

export const CreateProviderForm = ({ specialties = [] }: ProviderFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    specialties: [] as string[],
    profilePhoto: "",
    contactNumber: "",
    address: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyId)
        ? prev.specialties.filter((s) => s !== specialtyId)
        : [...prev.specialties, specialtyId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const result = await createProviderAction(formData);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          registrationNumber: "",
          specialties: [],
          profilePhoto: "",
          contactNumber: "",
          address: "",
          bio: "",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/admin/providers");
        }, 2000);
      } else {
        setError(result.message || "Failed to create provider");
      }
    } catch (err: Error | unknown) {
      type AxiosError = { response?: { data?: { errorSources?: Array<{ path: string; message: string }> } } };
      const axiosError = err as AxiosError;
      if (axiosError.response?.data?.errorSources) {
        const errors: Record<string, string> = {};
        axiosError.response.data.errorSources.forEach((source) => {
          errors[source.path] = source.message;
        });
        setFieldErrors(errors);
      }
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Provider Account</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Onboard a new service provider to the platform
      </p>

      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Provider account created successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Basic Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Provider name"
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="provider@email.com"
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 8 chars, uppercase, lowercase & number"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Professional Information</h2>

          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Registration Number
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g., REG-12345"
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
            {fieldErrors.registrationNumber && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.registrationNumber}</p>
            )}
          </div>

          {specialties.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Specialties <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {specialties.map((specialty) => (
                  <label key={specialty.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty.id)}
                      onChange={() => handleSpecialtyChange(specialty.id)}
                      disabled={loading}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{specialty.name}</span>
                  </label>
                ))}
              </div>
              {fieldErrors.specialties && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.specialties}</p>
              )}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contact Number (BD Format)
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="01XXXXXXXXX"
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
              />
              {fieldErrors.contactNumber && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.contactNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Profile Photo URL
              </label>
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="url"
                value={formData.profilePhoto}
                onChange={handleInputChange}
                placeholder="https://example.com/photo.jpg"
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
              />
              {fieldErrors.profilePhoto && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.profilePhoto}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address (min 5 characters)"
              disabled={loading}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief bio about the provider (max 500 characters)"
              disabled={loading}
              rows={4}
              maxLength={500}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:disabled:bg-slate-800"
            />
            <p className="mt-1 text-xs text-slate-500">{formData.bio.length}/500</p>
            {fieldErrors.bio && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.bio}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              !formData.registrationNumber ||
              formData.specialties.length === 0 ||
              formData.password !== formData.confirmPassword ||
              loading
            }
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Provider..." : "Create Provider"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Note: The provider will need to change their password on first login as their account will have
        needPasswordchange flag set to true.
      </p>
    </div>
  );
};
