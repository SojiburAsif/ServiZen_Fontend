"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppFilds";
import AppSubmitButton from "@/components/shared/form/AppSubmiteButon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/env";
import { clearGoogleOAuthLock, startGoogleOAuth } from "@/lib/googleOAuth";
import { registerAction } from "@/services/auth.service";
import { IRegisterPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AtSign, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const validateOptionalField = (schema: { safeParse: (value: string) => { success: boolean; error?: { issues: Array<{ message: string }> } } }) => {
  return ({ value }: { value: string }) => {
    if (!value.trim()) {
      return undefined;
    }

    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return parsed.error?.issues?.[0]?.message || "Invalid input";
    }

    return undefined;
  };
};

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
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

      const payload: IRegisterPayload = {
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

        if (!result.success) {
          setServerError(result.message || "Register failed");
          return;
        }

        setServerSuccess(result.message || "Account created successfully");
        form.reset();
        setTimeout(() => {
          router.push("/login");
        }, 800);
      } catch (error: any) {
        setServerError(`Register failed: ${error.message}`);
      }
    },
  });

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto border border-green-200/80 dark:border-emerald-700/40 shadow-2xl bg-gradient-to-b from-white to-green-100/40 dark:from-zinc-900 dark:to-emerald-950/20">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-emerald-900/60 text-green-700 dark:text-emerald-200 flex items-center justify-center shadow-md">
            <Image src="/favicon.ico" alt="Favicon" width={64} height={64} className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-950 dark:text-emerald-200">Join ServZEN</CardTitle>
          <CardDescription className="text-green-800 dark:text-emerald-300/70">Start your journey with us and experience quality services.</CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  onChange: validateOptionalField(AuthValidation.registerUserValidationSchema.shape.contactNumber),
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

            <form.Field name="email" validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.email }}>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            <form.Field
              name="profilePhoto"
              validators={{
                onChange: validateOptionalField(AuthValidation.registerUserValidationSchema.shape.profilePhoto),
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Profile Photo URL"
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  icon={<AtSign className="text-green-600" />}
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
              <Alert className="border-green-300 bg-green-50 text-green-900">
                <AlertDescription>{serverSuccess}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating Account..."
                  disabled={!canSubmit}
                  className="bg-green-600 text-white hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 w-full rounded-md shadow-md focus:ring-4 focus:ring-green-100"
                >
                  Register
                </AppSubmitButton>
              )}
            </form.Subscribe>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-200/80 dark:border-emerald-800/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-900 text-emerald-700/80 dark:text-emerald-300/70">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isGooglePending}
              className="w-full border-emerald-700/30 dark:border-emerald-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
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
                    setServerError("Google login already চলছে, একটু অপেক্ষা করে আবার চেষ্টা করুন.");
                    return;
                  }
                  setServerError("Google login start failed. Please try again.");
                }
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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

        <CardFooter className="justify-center border-t border-green-100 dark:border-emerald-900/40 pt-6 pb-8">
          <p className="text-sm text-green-900 dark:text-emerald-300/70">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 dark:text-emerald-300 font-semibold hover:underline underline-offset-4">
              Login now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;