"use client"
import AppField from "@/components/shared/form/AppFilds";
import AppSubmitButton from "@/components/shared/form/AppSubmiteButon";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/env";
import { clearGoogleOAuthLock, startGoogleOAuth } from "@/lib/googleOAuth";
import { clearPendingAuth, setPendingAuth } from "@/lib/pendingAuth";
import { loginAction } from "@/services/auth.service";
import { ILoginPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const isVerificationRequiredMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("verify") ||
    normalized.includes("verification") ||
    normalized.includes("email verified") ||
    normalized.includes("email not verified") ||
    normalized.includes("unverified")
  );
};

const extractErrorMessage = (error: unknown, fallback = "Login failed") => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const maybeError = error as { message?: string; response?: { data?: { message?: string } } };
    return maybeError.response?.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

const LoginForm = () => {
    // const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isGooglePending, setIsGooglePending] = useState(false);
    const oauthError = searchParams.get("error") === "state_mismatch"
      ? "Google login session mismatch. Please try again."
      : null;

    const { mutateAsync , isPending} = useMutation({
      mutationFn : (payload : ILoginPayload) => loginAction(payload),
    })

    useEffect(() => {
      clearGoogleOAuthLock();
    }, []);

    const form = useForm({
        defaultValues : {
            email : "",
            password : "",
        },

        onSubmit : async ({value}) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;
              const dashboardPath = "/dashboard";

                if(!result.success ){
              if (isVerificationRequiredMessage(result.message || "")) {
                      setPendingAuth(value.email, value.password);
                      router.push(`/verify-email?email=${encodeURIComponent(value.email)}&notice=${encodeURIComponent("otp-sent")}`);
                return;
              }

                    setServerError(result.message || "Login failed");
                    return ;
                }

                const userData = result?.data?.user || result?.data || {};
                const needPasswordChange = Boolean(userData?.needPasswordChange ?? userData?.needPasswordchange);
                if (needPasswordChange) {
                  clearPendingAuth();
                  router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
                  router.refresh();
                  return;
                }

                const isEmailVerified = Boolean(userData?.emailVerified);
            if (!isEmailVerified) {
                  setPendingAuth(value.email, value.password);
                  router.push(`/verify-email?email=${encodeURIComponent(value.email)}&notice=${encodeURIComponent("otp-sent")}`);
              return;
            }

                clearPendingAuth();
                router.push(dashboardPath);
                router.refresh();
            } catch (error : any) {
                setServerError(extractErrorMessage(error, "Login failed. Please try again."));
            }
        }
    })

  const handleGoogleLogin = () => {
    try {
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
    } catch (error) {
      setIsGooglePending(false);
      setServerError(extractErrorMessage(error, "Google login start failed. Please try again."));
    }
  };
  return (
    <Card className="w-full max-w-lg mx-auto border border-emerald-200/80 dark:border-emerald-700/40 shadow-xl bg-gradient-to-b from-white to-emerald-50/40 dark:from-zinc-900 dark:to-emerald-950/20">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto h-11 w-11 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center font-bold shadow-sm">
          SZ
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-950 dark:text-emerald-200">Welcome Back!</CardTitle>
        <CardDescription className="text-emerald-800/80 dark:text-emerald-300/70">
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field
            name="email"
            validators={{ onChange: AuthValidation.loginUserValidationSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
                inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: AuthValidation.loginUserValidationSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                // type="text"
                placeholder="Enter your password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
                inputClassName="border-emerald-200 focus-visible:ring-emerald-200 dark:border-emerald-800/50 dark:bg-zinc-900 dark:text-emerald-100"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {(serverError || oauthError) && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError || oauthError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In...."
                disabled={!canSubmit}
                className="bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
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
          variant="outline"
          disabled={isGooglePending}
          className="w-full border-emerald-700/30 dark:border-emerald-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          onClick={handleGoogleLogin}
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
          {isGooglePending ? "Redirecting to Google..." : "Sign in with Google"}
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t border-emerald-100 dark:border-emerald-900/40 pt-4">
        <p className="text-sm text-muted-foreground dark:text-emerald-300/70">
              Don&apos;t have an account?{" "}
            <Link
                href="/register"
                className="text-emerald-800 dark:text-emerald-300 font-semibold hover:underline underline-offset-4"
            >
                Sign Up for an account
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginForm