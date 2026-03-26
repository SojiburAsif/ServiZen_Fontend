import { httpClient } from '@/lib/axios/httpClient';
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
