"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  Camera,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  Loader2,
  X,
  UploadCloud,
} from "lucide-react";

import AppField from "@/components/shared/form/AppFilds";
import AppSubmitButton from "@/components/shared/form/AppSubmiteButon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env, publicEnv } from "@/lib/env";
import { clearGoogleOAuthLock, startGoogleOAuth } from "@/lib/googleOAuth";
import { clearPendingAuth, setPendingAuth } from "@/lib/pendingAuth";
import { registerAction } from "@/services/auth.service";
import { IRegisterPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";

const extractErrorMessage = (error: unknown, fallback = "Register failed") => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: string;
      response?: { data?: { message?: string } };
    };
    return maybeError.response?.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

const validateOptionalField = (schema: {
  safeParse: (value: string) => {
    success: boolean;
    error?: { issues: Array<{ message: string }> };
  };
}) => {
  return ({ value }: { value: string }) => {
    if (!value.trim()) return undefined;

    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return parsed.error?.issues?.[0]?.message || "Invalid input";
    }

    return undefined;
  };
};

const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }

      resolve(result.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, ""));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
  });
};

const uploadToImgbb = async (base64Image: string) => {
  const formData = new FormData();
  formData.append("image", base64Image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${env.NEXT_PUBLIC_IIMGBB_KEY}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const json = await res.json();
  return json?.data?.url as string;
};

const RegisterForm = () => {
  const router = useRouter();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  useEffect(() => {
    clearGoogleOAuthLock();
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      address: "",
      profilePhoto: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setServerSuccess(null);

      // Send profile photo as 'image' for backend compatibility
      const payload: any = {
        name: value.name,
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword,
        contactNumber: value.contactNumber || undefined,
        address: value.address || undefined,
        profilePhoto: value.profilePhoto || undefined,
      };

      try {
        const result = await mutateAsync(payload);


        if (!result?.success) {
          // Prisma unique constraint error (email already exists)
          if (
            result?.message &&
            /unique constraint.*email|already exists|duplicate.*email|email.*taken/i.test(result.message)
          ) {
            setServerError(
              "This email address is already registered. Please use a different email or login to your account."
            );
            return;
          }
          setServerError(result?.message || "Register failed");
          return;
        }

        setServerSuccess(result?.message || "Account created successfully");
        form.reset();
        setPreviewUrl(null);

        const userData = (result as any)?.data?.user || (result as any)?.data || {};
        const needPasswordChange = Boolean(userData?.needPasswordChange ?? userData?.needPasswordchange);

        if (typeof window !== "undefined") {
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
          });
          window.localStorage.clear();
          window.sessionStorage.clear();
        }

        setTimeout(() => {
          if (needPasswordChange) {
            clearPendingAuth();
            router.push(`/reset-password?email=${encodeURIComponent(payload.email)}`);
            return;
          }

          setPendingAuth(payload.email, payload.password);
          router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
        }, 800);
      } catch (error: unknown) {
        setServerError(extractErrorMessage(error, "Register failed. Please try again."));
      }
    },
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer.files?.[0] || null;
    } else {
      file = e.target.files?.[0] || null;
    }

    if (!file) return;

    setIsUploading(true);
    setServerError(null);

    try {
      const base64 = await getBase64(file);
      const url = await uploadToImgbb(base64);

      setPreviewUrl(url);
      form.setFieldValue("profilePhoto", url);
    } catch (err) {
      setServerError(extractErrorMessage(err, "Photo upload failed"));
    } finally {
      setIsUploading(false);
      setDragActive(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-green-200/80 dark:border-emerald-700/40 shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-3 pt-8 sm:pt-10 px-6 sm:px-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-emerald-900/60 text-green-700 dark:text-emerald-200 flex items-center justify-center shadow-md overflow-hidden ring-4 ring-white/70 dark:ring-zinc-900/60">
            <Image src="/favicon.ico" alt="Favicon" width={64} height={64} className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-green-950 dark:text-emerald-200">
            Join ServZEN
          </CardTitle>
          <CardDescription className="text-green-800 dark:text-emerald-300/70">
            Start your journey with us and experience quality services.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 md:px-8 pb-8">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Upload Box */}
            <div className="w-full">
              <div
                className={clsx(
                  "group relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border-2 border-dashed p-5 sm:p-6 md:p-8 transition-all duration-300",
                  dragActive
                    ? "border-emerald-500 bg-emerald-50/80 shadow-[0_0_0_6px_rgba(16,185,129,0.08)] dark:bg-emerald-950/20"
                    : "border-emerald-200 bg-white/70 hover:border-emerald-400 hover:bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-zinc-950/30 dark:hover:bg-emerald-950/10"
                )}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleImageUpload}
                tabIndex={0}
                role="button"
                aria-label="Upload profile photo"
              >
                <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 w-full">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                          onClick={() => {
                            setPreviewUrl(null);
                            form.setFieldValue("profilePhoto", "");
                          }}
                          aria-label="Remove photo"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <UploadCloud className="h-10 w-10 sm:h-11 sm:w-11" />
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-sm">
                        <Loader2 className="h-7 w-7 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-1 flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Upload your profile photo
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                        Drag & drop an image here, or click the upload button.
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl">
                        <Camera size={16} />
                        Choose photo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>

                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        PNG, JPG, JPEG
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <span className="mt-3 block text-center text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-400 dark:text-zinc-500">
                Profile Photo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <form.Field
                name="name"
                validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.name }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Full Name"
                    type="text"
                    placeholder="Enter your name"
                    icon={<User className="text-green-600" />}
                    inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                  />
                )}
              </form.Field>

              <form.Field
                name="contactNumber"
                validators={{
                  onChange: validateOptionalField(
                    AuthValidation.registerUserValidationSchema.shape.contactNumber
                  ),
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Contact Number"
                    type="text"
                    placeholder="01XXXXXXXXX"
                    icon={<Phone className="text-green-600" />}
                    inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                  />
                )}
              </form.Field>
            </div>

            <form.Field
              name="email"
              validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="text-green-600" />}
                  inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                />
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <form.Field
                name="password"
                validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Password"
                    type="password"
                    placeholder="Create password"
                    icon={<Lock className="text-green-600" />}
                    inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                  />
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.confirmPassword }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    icon={<Lock className="text-green-600" />}
                    inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                  />
                )}
              </form.Field>
            </div>

            <form.Field
              name="address"
              validators={{
                onChange: validateOptionalField(AuthValidation.registerUserValidationSchema.shape.address),
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Address"
                  type="text"
                  placeholder="Enter your address"
                  icon={<MapPin className="text-green-600" />}
                  inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                />
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {serverSuccess && (
              <Alert className="border-green-300 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100">
                <AlertDescription>{serverSuccess}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating Account..."
                  disabled={!canSubmit || isUploading}
                  className="w-full rounded-xl bg-green-600 text-white shadow-md transition hover:bg-green-700 hover:shadow-lg dark:bg-emerald-600 dark:hover:bg-emerald-500 focus:ring-4 focus:ring-green-100"
                >
                  Register
                </AppSubmitButton>
              )}
            </form.Subscribe>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-200/80 dark:border-emerald-800/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-zinc-900 text-emerald-700/80 dark:text-emerald-300/70">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isGooglePending}
              className="w-full rounded-xl border-emerald-700/30 py-6 dark:border-emerald-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              onClick={() => {
                setServerError(null);
                setIsGooglePending(true);

                const result = startGoogleOAuth({
                  apiBaseUrl: publicEnv.NEXT_PUBLIC_API_BASE_URL,
                  callbackPath: "/dashboard",
                  appOrigin: publicEnv.NEXT_PUBLIC_APP_ORIGIN,
                });

                if (!result.started) {
                  setIsGooglePending(false);
                  if (result.reason === "already_inflight") {
                    setServerError("Google login is already in progress. Please wait a moment and try again.");
                    return;
                  }

                  setServerError("Google login start failed. Please try again.");
                }
              }}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isGooglePending ? "Redirecting to Google..." : "Continue with Google"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-green-100 dark:border-emerald-900/40 px-6 pb-8 pt-6">
          <p className="text-sm text-green-900 dark:text-emerald-300/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-700 hover:underline underline-offset-4 dark:text-emerald-300"
            >
              Login now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
