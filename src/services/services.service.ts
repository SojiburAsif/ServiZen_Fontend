/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from '@/lib/axios/httpClient';
import { publicEnv } from "@/lib/env";
import { cookies } from "next/headers";
import { ApiResponse, type PaginationMeta } from '@/types/api.types';

const SERVICES_BASE = '/services';

const sanitizeQueryParams = (query?: ServiceListQuery) => {
  if (!query) return undefined;
  const cleaned = Object.entries(query).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return acc;
      acc[key] = trimmed;
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});

  return Object.keys(cleaned).length ? cleaned : undefined;
};

const withAuth = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const buildPaginationMeta = (
  meta: Partial<PaginationMeta> | undefined,
  query: ServiceListQuery | undefined,
  fallbackLength: number,
): PaginationMeta => {
  const inferredLimit = meta?.limit ?? query?.limit ?? (fallbackLength > 0 ? fallbackLength : 10);
  const inferredTotal = meta?.total ?? fallbackLength;
  const safeLimit = inferredLimit > 0 ? inferredLimit : 10;
  return {
    page: meta?.page ?? query?.page ?? 1,
    limit: safeLimit,
    total: inferredTotal,
    totalPages: meta?.totalPages ?? Math.max(1, Math.ceil((inferredTotal || 1) / safeLimit)),
  };
};

export interface ServiceSpecialtySnapshot {
  id: string;
  title?: string;
  description?: string;
  icon?: string | null;
}

export interface ServiceProviderSnapshot {
  id: string;
  name?: string;
  email?: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  averageRating?: number | null;
}

export interface ServiceRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string | null;
  specialtyId?: string | null;
  providerId: string;
  isActive: boolean;
  isDeleted?: boolean;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  specialty?: ServiceSpecialtySnapshot | null;
  provider?: ServiceProviderSnapshot | null;
  totalPaidAmount?: number;
  totalPaidBookings?: number;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  duration?: string;
  specialtyId?: string;
  imageUrl?: string;
}

export type UpdateServicePayload = Partial<CreateServicePayload> & {
  providerId?: string;
  isActive?: boolean;
};

export interface ServiceListQuery {
  page?: number;
  limit?: number;
  providerId?: string;
  specialtyId?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  category?: string;
  priceSort?: "asc" | "desc";
}

type ServiceListEnvelope = {
  data?: ServiceRecord[];
  meta?: Partial<PaginationMeta>;
};

type ServiceDetailsEnvelope = {
  data?: ServiceRecord | ServiceRecord[] | null;
};

type ServiceDetailsPayload = ServiceRecord | ServiceRecord[] | ServiceDetailsEnvelope | null | undefined;

const isServiceRecord = (value: unknown): value is ServiceRecord => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof (value as { id?: unknown }).id === 'string',
  );
};

const isServiceDetailsEnvelope = (value: unknown): value is ServiceDetailsEnvelope => {
  return Boolean(value && typeof value === 'object' && 'data' in value);
};

// Handles inconsistent backend payloads by unwrapping nested envelopes/arrays.
const extractServiceRecord = (payload: ServiceDetailsPayload): ServiceRecord | null => {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload.find(isServiceRecord) ?? null;
  }

  if (isServiceRecord(payload)) {
    return payload;
  }

  if (isServiceDetailsEnvelope(payload)) {
    const nested = payload.data;
    if (!nested) {
      return null;
    }

    if (Array.isArray(nested)) {
      return nested.find(isServiceRecord) ?? null;
    }

    if (isServiceRecord(nested)) {
      return nested;
    }
  }

  return null;
};

const normalizeServiceListResponse = (
  response: ApiResponse<ServiceRecord[] | ServiceListEnvelope>,
  query?: ServiceListQuery,
): ApiResponse<ServiceRecord[]> => {
  const payload = response.data;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const nestedMeta = response.meta ?? (!Array.isArray(payload) ? payload?.meta : undefined);
  const normalizedMeta = buildPaginationMeta(nestedMeta, query, list.length);

  return {
    ...response,
    data: list,
    meta: normalizedMeta,
  };
};

export const createService = async (
  payload: CreateServicePayload,
  token?: string,
): Promise<ApiResponse<ServiceRecord>> => {
  return httpClient.post<ServiceRecord>(`${SERVICES_BASE}/create-service`, payload, {
    headers: withAuth(token),
  });
};

export const getAllServices = async (
  query?: ServiceListQuery,
): Promise<ApiResponse<ServiceRecord[]>> => {
  const response = await httpClient.get<ServiceRecord[] | ServiceListEnvelope>(`${SERVICES_BASE}/all-services`, {
    params: sanitizeQueryParams(query),
  });

  return normalizeServiceListResponse(response, query);
};

export const getServicesByProvider = async (
  providerId: string,
  query?: Omit<ServiceListQuery, 'providerId'>,
): Promise<ApiResponse<ServiceRecord[]>> => {
  return getAllServices({ ...query, providerId });
};

export const getServiceById = async (
  serviceId: string,
): Promise<ApiResponse<ServiceRecord | null>> => {
  const response = await httpClient.get<ServiceRecord | ServiceRecord[] | ServiceDetailsEnvelope | null>(`${SERVICES_BASE}/${serviceId}`);
  return {
    ...response,
    data: extractServiceRecord(response.data),
  };
};

export const updateService = async (
  serviceId: string,
  payload: UpdateServicePayload,
  token?: string,
): Promise<ApiResponse<ServiceRecord>> => {
  return httpClient.patch<ServiceRecord>(`${SERVICES_BASE}/${serviceId}`, payload, {
    headers: withAuth(token),
  });
};

export const deleteService = async (
  serviceId: string,
  token?: string,
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(`${SERVICES_BASE}/${serviceId}`, {
    headers: withAuth(token),
  });
};

// Server Actions for Services

// Create Service (Provider)
export const createServiceServerAction = async (
  payload: CreateServicePayload
): Promise<ApiResponse<ServiceRecord> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/services/create-service`, {
      method: 'POST',
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

    const data: ApiResponse<ServiceRecord> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Service creation failed: ${error.message}`,
    };
  }
};

// Get All Services (Public)
export const getAllServicesServerAction = async (
  query?: ServiceListQuery
): Promise<ApiResponse<ServiceRecord[]> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const sanitizedQuery = sanitizeQueryParams(query);
    const queryString = sanitizedQuery ? `?${new URLSearchParams(sanitizedQuery as Record<string, string>)}` : '';

    const response = await fetch(`${API_BASE_URL}/services/all-services${queryString}`, {
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

    const data: ApiResponse<ServiceRecord[] | ServiceListEnvelope> = await response.json();

    // Normalize the response to ensure data is always an array
    const payload = data.data;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    const nestedMeta = data.meta ?? (!Array.isArray(payload) ? payload?.meta : undefined);
    const normalizedMeta = buildPaginationMeta(nestedMeta, query, list.length);

    return {
      ...data,
      data: list,
      meta: normalizedMeta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch services: ${error.message}`,
    };
  }
};

// Get Services by Provider (Provider/Admin)
export const getServicesByProviderServerAction = async (
  providerId: string,
  query?: ServiceListQuery
): Promise<ApiResponse<ServiceRecord[]> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const sanitizedQuery = sanitizeQueryParams({ ...query, providerId });
    const queryString = sanitizedQuery ? `?${new URLSearchParams(sanitizedQuery as Record<string, string>)}` : '';

    const response = await fetch(`${API_BASE_URL}/services/all-services${queryString}`, {
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

    const data: ApiResponse<ServiceRecord[] | ServiceListEnvelope> = await response.json();

    // Normalize the response to ensure data is always an array
    const payload = data.data;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    const nestedMeta = data.meta ?? (!Array.isArray(payload) ? payload?.meta : undefined);
    const normalizedMeta = buildPaginationMeta(nestedMeta, { ...query, providerId }, list.length);

    return {
      ...data,
      data: list,
      meta: normalizedMeta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch provider services: ${error.message}`,
    };
  }
};

// Get Service by ID (Public)
export const getServiceByIdServerAction = async (
  serviceId: string
): Promise<ApiResponse<ServiceRecord> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
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

    const data: ApiResponse<ServiceRecord> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to fetch service: ${error.message}`,
    };
  }
};

// Update Service (Provider)
export const updateServiceServerAction = async (
  serviceId: string,
  payload: UpdateServicePayload
): Promise<ApiResponse<ServiceRecord> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
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

    const data: ApiResponse<ServiceRecord> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Service update failed: ${error.message}`,
    };
  }
};

// Delete Service (Provider)
export const deleteServiceServerAction = async (
  serviceId: string
): Promise<ApiResponse<null> | { success: false; message: string }> => {
  try {
    const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
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

    const data: ApiResponse<null> = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Service deletion failed: ${error.message}`,
    };
  }
};
