/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";

import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginPayload, ILoginSuccessData, IRegisterPayload } from "@/types/auth.typs";
import { AuthValidation } from "@/zod/auth.validation";


import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload): Promise<ApiResponse<ILoginSuccessData> | ApiErrorResponse> => {
    const parsedPayload = AuthValidation.loginUserValidationSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<ILoginSuccessData>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token} = response.data;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

        redirect("/dashboard");
        return response;
        
    } catch (error : any) {
    if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
        throw error;
    }
        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }
    }
}

export const registerAction = async (
    payload: IRegisterPayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
    const parsedPayload = AuthValidation.registerUserValidationSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    const { confirmPassword, ...registerPayload } = parsedPayload.data;
    void confirmPassword;

    try {
        const response = await httpClient.post<unknown>("/auth/register", registerPayload);
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: `Register failed: ${error.message}`,
        };
    }
};