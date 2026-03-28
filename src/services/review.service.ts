import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse, type PaginationMeta } from '@/types/api.types';

const REVIEWS_BASE = '/reviews';

export interface ReviewRecord {
  id: string;
  rating: number;
  comment: string;
  bookingId: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  createdAt: string;
  provider: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  booking: {
    id: string;
    status: string;
  };
}

export interface ReviewListQuery {
  page?: number;
  limit?: number;
  rating?: number;
  serviceId?: string;
  clientId?: string;
}

type ReviewListEnvelope = {
  data?: ReviewRecord[];
  meta?: Partial<PaginationMeta>;
};

const sanitizeQueryParams = (query?: ReviewListQuery) => {
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

const buildPaginationMeta = (
  meta: Partial<PaginationMeta> | undefined,
  query: ReviewListQuery | undefined,
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

const normalizeReviewListResponse = (
  response: ApiResponse<ReviewRecord[] | ReviewListEnvelope>,
  query?: ReviewListQuery,
): ApiResponse<ReviewRecord[]> => {
  const payload = response.data;

  // Handle nested response structure from backend
  let list: ReviewRecord[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nestedMeta: any = undefined;

  if (Array.isArray(payload)) {
    // Direct array response
    list = payload;
  } else if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      // Backend response structure: { data: { meta: {...}, data: [...] } }
      list = payload.data;
      nestedMeta = payload.meta;
    } else if (Array.isArray(payload)) {
      // Fallback for array in data
      list = payload;
    } else {
      // Empty or invalid response
      list = [];
    }
  }

  const normalizedMeta = buildPaginationMeta(nestedMeta, query, list.length);

  return {
    ...response,
    data: list,
    meta: normalizedMeta,
  };
};

// Get All Reviews (Provider - their own reviews)
export const getProviderReviews = async (
  query?: ReviewListQuery,
): Promise<ApiResponse<ReviewRecord[]>> => {
  const response = await httpClient.get<ReviewRecord[] | ReviewListEnvelope>(REVIEWS_BASE, {
    params: sanitizeQueryParams(query),
  });

  return normalizeReviewListResponse(response, query);
};

// Get Review by ID
export const getReviewById = async (
  reviewId: string,
): Promise<ApiResponse<ReviewRecord>> => {
  return httpClient.get<ReviewRecord>(`${REVIEWS_BASE}/${reviewId}`);
};

// Create Review (Client)
export const createReview = async (
  data: {
    rating: number;
    comment: string;
    bookingId: string;
    serviceId: string;
  },
  token?: string,
): Promise<ApiResponse<ReviewRecord>> => {
  return httpClient.post<ReviewRecord>(REVIEWS_BASE, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

// Update Review (Client - only their own)
export const updateReview = async (
  reviewId: string,
  data: Partial<{
    rating: number;
    comment: string;
  }>,
  token?: string,
): Promise<ApiResponse<ReviewRecord>> => {
  return httpClient.patch<ReviewRecord>(`${REVIEWS_BASE}/${reviewId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

// Delete Review (Admin only)
export const deleteReview = async (
  reviewId: string,
  token?: string,
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(`${REVIEWS_BASE}/${reviewId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

// Get All Reviews (Admin only)
export const getAllReviews = async (
  query?: ReviewListQuery,
): Promise<ApiResponse<ReviewRecord[]>> => {
  const response = await httpClient.get<ReviewRecord[] | ReviewListEnvelope>(REVIEWS_BASE, {
    params: sanitizeQueryParams(query),
  });

  return normalizeReviewListResponse(response, query);
};