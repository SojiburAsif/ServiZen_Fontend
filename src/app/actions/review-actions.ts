/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import "server-only";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";
import { ApiResponse, type PaginationMeta } from '@/types/api.types';

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

const REVIEWS_BASE = '/reviews';

const getAuthHeaders = async (includeContentType = true) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  const sessionData = cookieStore.get("better-auth.session_data")?.value;

  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // For review creation, we need to send cookies since backend auth middleware expects them
  // Build cookie header with all available auth cookies
  const cookieArray = [];
  if (accessToken) {
    cookieArray.push(`accessToken=${accessToken}`);
  }
  if (sessionToken) {
    cookieArray.push(`better-auth.session_token=${sessionToken}`);
  }
  if (sessionData) {
    cookieArray.push(`better-auth.session_data=${sessionData}`);
  }

  if (cookieArray.length > 0) {
    headers.Cookie = cookieArray.join('; ');
  }

  return headers;
};

const getApiUrl = () => {
  const { BASE_API_URL } = getServerEnv();
  return BASE_API_URL.replace(/\/$/, ''); // Remove trailing slash
};

const sanitizeQueryParams = (query?: ReviewListQuery) => {
  if (!query) return undefined;
  const cleaned = Object.entries(query).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    if (typeof value === 'string') {
      acc[key] = value.trim();
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
  return cleaned;
};

const normalizeReviewListResponse = (
  apiResponse: any,
  query?: ReviewListQuery
): ApiResponse<ReviewRecord[]> => {
  // The API returns: { success, message, data: { meta, data: [...] } }
  const responseData = apiResponse.data;

  if (!responseData) {
    return {
      success: false,
      message: "Invalid response format",
      data: [],
      meta: {
        page: query?.page || 1,
        limit: query?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }

  // Check if responseData has meta and data properties (nested structure)
  if (responseData.meta && responseData.data) {
    const data = Array.isArray(responseData.data) ? responseData.data : [];
    const meta = responseData.meta;
    const limit = meta.limit || query?.limit || 10;
    const total = meta.total || data.length;

    return {
      success: true,
      message: apiResponse.message || "Reviews fetched successfully",
      data,
      meta: {
        page: meta.page || query?.page || 1,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  // Fallback: if responseData is directly an array
  if (Array.isArray(responseData)) {
    const limit = query?.limit || 10;
    return {
      success: true,
      message: apiResponse.message || "Reviews fetched successfully",
      data: responseData,
      meta: {
        page: query?.page || 1,
        limit,
        total: responseData.length,
        totalPages: Math.max(1, Math.ceil(responseData.length / limit)),
      },
    };
  }

  // Unexpected format
  return {
    success: false,
    message: "Unexpected response format",
    data: [],
    meta: {
      page: query?.page || 1,
      limit: query?.limit || 10,
      total: 0,
      totalPages: 1,
    },
  };
};

// Get All Reviews (Admin only)
export const getAllReviews = async (
  query?: ReviewListQuery,
): Promise<ApiResponse<ReviewRecord[]>> => {
  try {
    const headers = await getAuthHeaders();
    const baseUrl = getApiUrl();

    const params = sanitizeQueryParams(query);
    const url = new URL(`${baseUrl}${REVIEWS_BASE}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return normalizeReviewListResponse(data, query);
  } catch (error) {
    console.error('getAllReviews error:', error);
    const limit = query?.limit || 10;
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch reviews',
      data: [],
      meta: {
        page: query?.page || 1,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  }
};

// Delete Review (Admin only)
export const deleteReview = async (
  reviewId: string,
): Promise<ApiResponse<null>> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const headers: Record<string, string> = {};

    console.log('Delete Review - Tokens available:', {
      accessToken: accessToken ? 'yes' : 'no',
      sessionToken: sessionToken ? 'yes' : 'no'
    });

    // Send both tokens as cookies to cover all possibilities
    const cookieArray = [];
    if (accessToken) {
      cookieArray.push(`accessToken=${accessToken}`);
    }
    if (sessionToken) {
      cookieArray.push(`better-auth.session_token=${sessionToken}`);
    }

    if (cookieArray.length > 0) {
      headers.Cookie = cookieArray.join('; ');
    }

    const baseUrl = getApiUrl();
    const url = `${baseUrl}${REVIEWS_BASE}/${reviewId}`;

    console.log('Delete Review - URL:', url);
    console.log('Delete Review - Headers:', headers);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    console.log('Delete Review - Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.log('Delete Review - Error response:', errorData);
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.log('Could not read error response body');
      }
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: null,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error('deleteReview error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete review',
      data: null,
    };
  }
};

// Get Review by ID
export const getReviewById = async (
  reviewId: string,
): Promise<ApiResponse<ReviewRecord>> => {
  try {
    const headers = await getAuthHeaders();
    const baseUrl = getApiUrl();

    const response = await fetch(`${baseUrl}${REVIEWS_BASE}/${reviewId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: "Review retrieved successfully",
      data: data.data || data, // Handle both direct and wrapped responses
    };
  } catch (error) {
    console.error('getReviewById error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch review',
      data: {} as ReviewRecord,
    };
  }
};

// Create Review (Client)
export const createReview = async (
  data: {
    rating: number;
    comment?: string; // Make comment optional
    bookingId: string;
  },
): Promise<ApiResponse<ReviewRecord>> => {
  try {
    const headers = await getAuthHeaders();
    const baseUrl = getApiUrl();

    // Remove serviceId from payload as it's not needed - backend gets it from booking
    const { serviceId, ...payload } = data as any;

    const response = await fetch(`${baseUrl}${REVIEWS_BASE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('createReview error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      message: "Review created successfully",
      data: responseData.data || responseData,
    };
  } catch (error) {
    console.error('createReview error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create review',
      data: {} as ReviewRecord,
    };
  }
};

// Update Review (Client - only their own)
export const updateReview = async (
  reviewId: string,
  data: Partial<{
    rating: number;
    comment: string;
  }>,
): Promise<ApiResponse<ReviewRecord>> => {
  try {
    const headers = await getAuthHeaders();
    const baseUrl = getApiUrl();

    const response = await fetch(`${baseUrl}${REVIEWS_BASE}/${reviewId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      message: "Review updated successfully",
      data: responseData.data || responseData,
    };
  } catch (error) {
    console.error('updateReview error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update review',
      data: {} as ReviewRecord,
    };
  }
};

// Get My Reviews (Provider - their own reviews)
export const getMyProviderReviews = async (
  query?: ReviewListQuery,
): Promise<ApiResponse<ReviewRecord[]>> => {
  try {
    const headers = await getAuthHeaders();
    const baseUrl = getApiUrl();

    const params = sanitizeQueryParams(query);
    const url = new URL(`${baseUrl}${REVIEWS_BASE}/my`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return normalizeReviewListResponse(data, query);
  } catch (error) {
    console.error('getMyProviderReviews error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch provider reviews',
      data: [],
      meta: {
        page: query?.page || 1,
        limit: query?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }
};