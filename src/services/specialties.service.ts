/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicEnv } from "@/lib/env";
import { cookies } from "next/headers";
import { ApiResponse } from '@/types/api.types';

export interface Specialty {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  isDeleted?: boolean;
}

export interface ProviderSpecialtyRecord {
  specialty: Specialty | null;
}

export interface ProviderSpecialtyPayload {
  id: string;
  name: string;
  specialties: ProviderSpecialtyRecord[];
}

// Create Specialty (Admin)
export const createSpecialtyServerAction = async (
  data: { title: string; description?: string; icon?: string }
): Promise<ApiResponse<Specialty> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/specialties/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(data),
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
11
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

    const result: ApiResponse<Specialty> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Specialty creation failed: ${error.message}`,
    };
  }
};

// Get All Specialties (Public)
export const getAllSpecialtiesServerAction = async (): Promise<ApiResponse<Specialty[]> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${API_BASE_URL}/specialties/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

    const result: ApiResponse<Specialty[]> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch specialties: ${error.message}`,
    };
  }
};

// Get My Specialties (Provider)
export const getMySpecialtiesServerAction = async (): Promise<ApiResponse<ProviderSpecialtyPayload> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/specialties/me`, {
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

    const result: ApiResponse<ProviderSpecialtyPayload> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch my specialties: ${error.message}`,
    };
  }
};

// Add My Specialties (Provider)
export const addMySpecialtiesServerAction = async (
  specialties: string[]
): Promise<ApiResponse<Specialty[]> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/specialties/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ specialties }),
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

    const result: ApiResponse<Specialty[]> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to add specialties: ${error.message}`,
    };
  }
};

// Remove My Specialty (Provider)
export const removeMySpecialtyServerAction = async (
  specialtyId: string
): Promise<ApiResponse<null> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/specialties/me/${specialtyId}`, {
      method: 'DELETE',
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

    const result: ApiResponse<null> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to remove specialty: ${error.message}`,
    };
  }
};

// Delete Specialty (Admin)
export const deleteSpecialtyServerAction = async (
  specialtyId: string
): Promise<ApiResponse<null> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/specialties/${specialtyId}`, {
      method: 'DELETE',
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

    const result: ApiResponse<null> = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to delete specialty: ${error.message}`,
    };
  }
};
