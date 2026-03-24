"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppFilds";
import AppSubmitButton from "@/components/shared/form/AppSubmiteButon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerAction } from "@/services/auth.service";
import { IRegisterPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <Card className="w-full max-w-lg mx-auto border border-emerald-200/80 shadow-xl bg-gradient-to-b from-white to-emerald-50/40">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto h-11 w-11 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center font-bold">
          SZ
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-950">Create Account</CardTitle>
        <CardDescription>Join ServZEN with a secure account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="name"
              validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.name }}
            >
              {(field) => (
                <AppField field={field} label="Full Name" type="text" placeholder="Enter your name" />
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
                <AppField field={field} label="Contact Number" type="text" placeholder="01XXXXXXXXX" />
              )}
            </form.Field>
          </div>

          <form.Field
            name="email"
            validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.email }}
          >
            {(field) => (
              <AppField field={field} label="Email" type="email" placeholder="Enter your email" />
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="password"
              validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.password }}
            >
              {(field) => (
                <AppField field={field} label="Password" type="password" placeholder="Create password" />
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{ onChange: AuthValidation.registerUserValidationSchema.shape.confirmPassword }}
            >
              {(field) => (
                <AppField field={field} label="Confirm Password" type="password" placeholder="Confirm password" />
              )}
            </form.Field>
          </div>

          <form.Field
            name="address"
            validators={{
              onChange: validateOptionalField(
                AuthValidation.registerUserValidationSchema.shape.address
              ),
            }}
          >
            {(field) => (
              <AppField field={field} label="Address" type="text" placeholder="Enter your address" />
            )}
          </form.Field>

          <form.Field
            name="profilePhoto"
            validators={{
              onChange: validateOptionalField(
                AuthValidation.registerUserValidationSchema.shape.profilePhoto
              ),
            }}
          >
            {(field) => (
              <AppField field={field} label="Profile Photo URL" type="text" placeholder="https://example.com/photo.jpg" />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {serverSuccess && (
            <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900">
              <AlertDescription>{serverSuccess}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating Account..."
                disabled={!canSubmit}
                className="bg-emerald-800 text-white hover:bg-emerald-900"
              >
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-emerald-100 pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-800 font-semibold hover:underline underline-offset-4">
            Login now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
