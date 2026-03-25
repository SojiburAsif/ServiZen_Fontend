import { ApiResponse } from '@/types/api.types';
import { httpClient } from '@/lib/axios/httpClient';

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
const authHeaders = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

export const createSpecialty = async (
  data: { title: string; description?: string; icon?: string },
  token?: string
): Promise<ApiResponse<Specialty>> => {
  return httpClient.post<Specialty>(
    '/specialties/',
    data,
    { headers: authHeaders(token) }
  );
};

// Get All Specialties (Public)
export const getAllSpecialties = async (): Promise<ApiResponse<Specialty[]>> => {
  return httpClient.get<Specialty[]>('/specialties/');
};

// Get My Specialties (Provider)
export const getMySpecialties = async (token?: string): Promise<ApiResponse<ProviderSpecialtyPayload>> => {
  return httpClient.get<ProviderSpecialtyPayload>(
    '/specialties/me',
    { headers: authHeaders(token) }
  );
};

// Add My Specialties (Provider)
export const addMySpecialties = async (
  specialties: string[],
  token?: string
): Promise<ApiResponse<Specialty[]>> => {
  return httpClient.post<Specialty[]>(
    '/specialties/me',
    { specialties },
    { headers: authHeaders(token) }
  );
};

// Remove My Specialty (Provider)
export const removeMySpecialty = async (
  specialtyId: string,
  token?: string
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(
    `/specialties/me/${specialtyId}`,
    { headers: authHeaders(token) }
  );
};

// Delete Specialty (Admin)
export const deleteSpecialty = async (
  id: string,
  token?: string
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(
    `/specialties/${id}`,
    { headers: authHeaders(token) }
  );
};
