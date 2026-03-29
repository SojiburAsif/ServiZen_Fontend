import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const getErrorMessage = (error : unknown) : string => {
    if (typeof error === "string") return error;

    if(error && typeof error === "object"){
        if("message" in error && typeof error.message === "string"){
            return error.message;
        }
    }

    return String(error);
}

type AppFieldProps = {
    field : AnyFieldApi;
    label : string;
    type ?: "text" | "email" | "password" | "number";
    placeholder ?: string;
    icon ?: React.ReactNode;
    append ?: React.ReactNode;
    prepend ?: React.ReactNode;
    className ?: string;
    inputClassName ?: string;
    disabled ?: boolean;
}

const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    icon,
    append,
    prepend,
    className,
    inputClassName,
    disabled = false,
} : AppFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const leadingAdornment = prepend ?? icon;

    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

    const firstError = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? getErrorMessage(field.state.meta.errors[0]) : null;

    const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5", className)}>
        <Label
            htmlFor={field.name}
            className={cn(hasError && "text-destructive")}
        >
            {label}
        </Label>

        <div className="relative">
            {
                leadingAdornment && (<div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
                    {leadingAdornment}
                </div>)
            }

            <Input
                id={field.name}
                name={field.name}
                type={currentType}
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : undefined}
                className={cn(
                    "h-12 text-base",
                    leadingAdornment && "pl-12",
                    "dark:bg-slate-900",
                    (append || isPasswordType) && "pr-12",
                    hasError && "border-destructive focus-visible:ring-destructive/20",
                    inputClassName,
                )}
            />

            {isPasswordType && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {
                !isPasswordType && append && (<div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex items-center">
                    {append}
                </div>)
            }
        </div>

        <p
            id={`${field.name}-error`}
            role="alert"
            className={cn("min-h-5 text-sm", hasError ? "text-destructive" : "text-transparent")}
        >
            {hasError ? firstError : "_"}
        </p>
    </div>
  )
}

export default AppField