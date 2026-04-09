/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AppField from "@/components/shared/form/AppFilds";
import AppSubmitButton from "@/components/shared/form/AppSubmiteButon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { publicEnv } from "@/lib/env";
import { clearGoogleOAuthLock, startGoogleOAuth } from "@/lib/googleOAuth";
import { clearPendingAuth, setPendingAuth } from "@/lib/pendingAuth";
import { loginAction } from "@/services/auth.service";
import { ILoginPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";

// --- Helper functions for error handling ---
const isVerificationRequired = (msg: string) =>
  /verify|verification|unverified|not verified/i.test(msg);

const extractError = (err: unknown) =>
  (err as any)?.response?.data?.message || (err as any)?.message || "Login failed";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const oauthError = searchParams.get("error") === "state_mismatch"
    ? "Session mismatch. Please try again."
    : null;

  useEffect(() => {
    clearGoogleOAuthLock();
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload),
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;

        // 1. Logic for Success response (200 OK)
        if (result?.success) {
          const userData = result?.data?.user || result?.data || {};

          if (userData?.needPasswordChange) {
            router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
            return;
          }

          clearPendingAuth();
          toast.success("Welcome back! Login successful.");
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setServerError(result?.message || "Invalid credentials");

      } catch (error: any) {
        // 3. Backend throws 4xx or 500 error (Most likely case)
        const errMsg = extractError(error);

        // Otherwise, show standard error UI
        setServerError(errMsg);
        toast.error(errMsg);
      }
    }
  });

  const handleGoogleLogin = () => {
    setIsGooglePending(true);
    const result = startGoogleOAuth({
      apiBaseUrl: publicEnv.NEXT_PUBLIC_API_BASE_URL,
      callbackPath: "/dashboard",
      appOrigin: publicEnv.NEXT_PUBLIC_APP_ORIGIN,
    });
    if (!result.started) setIsGooglePending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-auto w-full max-w-xs sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg overflow-hidden border-emerald-100 bg-white dark:bg-black shadow-2xl backdrop-blur-xl dark:border-emerald-900/30 rounded-2xl">
        <CardHeader className="space-y-3 pb-6 pt-4 text-center">
          <div className="flex justify-center">
            <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-95">
              <img src="/favicon.ico" alt="" className="h-12 w-12 transition-transform group-hover:scale-110 rounded-full animate-spin-slow" />
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Serv<span className="font-serif italic text-gray-500 dark:text-gray-400">ZEN</span>
              </span>
            </Link>
          </div>
          <div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-emerald-950 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-emerald-800/60 dark:text-emerald-400/60">
              Unlock your dashboard and start managing.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 md:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field name="email" validators={{ onChange: AuthValidation.loginUserValidationSchema.shape.email }}>
              {(field) => (
                <div className="relative group">
                  <Mail className="absolute left-3 top-9.5 h-5 w-5 text-emerald-500/50 transition-colors group-focus-within:text-emerald-500 z-10" />
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    inputClassName="pl-10 h-12 rounded-xl border-emerald-100 focus:ring-emerald-500/20 dark:border-emerald-900/50 dark:bg-slate-900"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="password" validators={{ onChange: AuthValidation.loginUserValidationSchema.shape.password }}>
              {(field) => (
                <div className="relative group">
                  <Lock className="absolute left-3 top-9.5 h-5 w-5 text-emerald-500/50 transition-colors group-focus-within:text-emerald-500 z-10" />
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    inputClassName="pl-10 h-12 rounded-xl border-emerald-100 focus:ring-emerald-500/20 dark:border-emerald-900/50 dark:bg-slate-900"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    }
                  />
                </div>
              )}
            </form.Field>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
                Forgot password?
              </Link>
            </div>

            {(serverError || oauthError) && (
              <Alert variant="destructive" className="rounded-xl bg-red-50 dark:bg-red-950/20">
                <AlertDescription>{serverError || oauthError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Authenticating..."
                  disabled={!canSubmit}
                  className="h-12 w-full rounded-xl bg-emerald-600 text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Log In
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100 dark:border-emerald-900/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-emerald-800/40 dark:bg-slate-950 dark:text-emerald-400/40">
                Or join with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            disabled={isGooglePending}
            onClick={handleGoogleLogin}
            className="h-12 w-full rounded-xl border-emerald-100 font-bold hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/50"
          >
            {isGooglePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
            )}
            Google
          </Button>

          {/* Legal Links */}
          <div className="mt-8 pt-6 border-t border-emerald-200/80 dark:border-emerald-800/50">
            <p className="text-xs text-center text-slate-600 dark:text-slate-400 leading-relaxed">
              View our{" "}
              <Link
                href="/terms-of-service"
                className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href="/privacy-policy"
                className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              , or{" "}
              <Link
                href="/faq"
                className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold underline-offset-2 hover:underline"
              >
                FAQ
              </Link>
              .
            </p>
          </div>
        </CardContent>

        <CardFooter className="pb-10 pt-6 justify-center">
          <p className="text-sm text-slate-500 dark:text-emerald-400/60 font-medium">
            New here? <Link href="/register" className="text-emerald-700 font-bold hover:underline dark:text-emerald-400">Create an account</Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;