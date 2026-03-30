/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicEnv } from "@/lib/env";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types/api.types";
import type { ProviderSelfProfile } from "@/services/provider.service";

export type UpdateProviderProfilePayload = {
  name?: string;
  email?: string;
  contactNumber?: string | null;
  address?: string | null;
  registrationNumber?: string | null;
  experience?: number | string | null;
  bio?: string | null;
  profilePhoto?: string | null;
};

export const updateProviderProfileServerAction = async (
  payload: UpdateProviderProfilePayload,
): Promise<ApiResponse<ProviderSelfProfile> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/providers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }

        // Handle Zod validation errors with detailed field information
        if (errorData?.errorSources && Array.isArray(errorData.errorSources)) {
          const fieldErrors = errorData.errorSources
            .map((source: any) => source.message || source.field)
            .filter(Boolean)
            .join(', ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }

        // Handle nested error structures
        if (errorData?.issues && Array.isArray(errorData.issues)) {
          const validationErrors = errorData.issues
            .map((issue: any) => `${issue.path?.join('.') || 'field'}: ${issue.message}`)
            .join('; ');
          if (validationErrors) {
            errorMessage = validationErrors;
          }
        }

        // Handle errors array
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors
            .map((err: any) => err.message || err)
            .filter(Boolean)
            .join(', ');
          if (errorMessages) {
            errorMessage = errorMessages;
          }
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponse<ProviderSelfProfile> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Profile update failed: ${error.message}`,
    };
  }
};

// Get Provider Self Profile (Provider)
export const getProviderSelfProfileServerAction = async (): Promise<ApiResponse<ProviderSelfProfile> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/providers/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponse<ProviderSelfProfile> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch provider profile: ${error.message}`,
    };
  }
};
