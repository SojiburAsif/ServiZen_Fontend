import z from "zod";
const bdPhoneRegex = /^(?:\+?8801\d{9}|01\d{9})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


const registerUserValidationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            passwordRegex,
            "Password must include uppercase, lowercase and number"
        ),
    confirmPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
    profilePhoto: z
        .string()
        .trim()
        .url("Profile photo must be a valid URL")
        .optional(),
    contactNumber: z
        .string()
        .trim()
        .regex(bdPhoneRegex, "Invalid Bangladeshi contact number")
        .optional(),
    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters")
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
});

const loginUserValidationSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

const changePasswordValidationSchema = z.object({
    currentPassword: z
        .string()
        .min(8, "Current password must be at least 8 characters"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            passwordRegex,
            "Password must include uppercase, lowercase and number"
        ),
    confirmNewPassword: z
        .string()
        .min(8, "Confirm new password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmNewPassword"],
});

const verifyEmailValidationSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits"),
});

const forgetPasswordValidationSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
});

const resetPasswordValidationSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            passwordRegex,
            "Password must include uppercase, lowercase and number"
        ),
    confirmNewPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password and confirm password must match",
    path: ["confirmNewPassword"],
});

const createProviderValidationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            passwordRegex,
            "Password must include uppercase, lowercase and number"
        ),
    confirmPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters"),
    registrationNumber: z
        .string()
        .trim()
        .min(1, "Registration number is required"),
    specialties: z
        .array(z.string().uuid("Invalid specialty ID"))
        .min(1, "At least one specialty is required"),
    profilePhoto: z
        .string()
        .trim()
        .url("Profile photo must be a valid URL")
        .optional(),
    contactNumber: z
        .string()
        .trim()
        .regex(bdPhoneRegex, "Invalid Bangladeshi contact number")
        .optional(),
    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters")
        .optional(),
    bio: z
        .string()
        .trim()
        .max(500, "Bio cannot exceed 500 characters")
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
});

export const AuthValidation = {
    registerUserValidationSchema,
    loginUserValidationSchema,
    changePasswordValidationSchema,
    verifyEmailValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
    createProviderValidationSchema,
};