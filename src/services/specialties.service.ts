import { ApiResponse } from '@/types/api.types';
import { httpClient } from '@/lib/axios/httpClient';

export interface Specialty {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  isDeleted?: boolean;
}

// Create Specialty (Admin)
export const createSpecialty = async (
  data: { title: string; description?: string; icon?: string },
  token: string
): Promise<ApiResponse<Specialty>> => {
  return httpClient.post<Specialty>(
    '/specialties/',
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Get All Specialties (Public)
export const getAllSpecialties = async (): Promise<ApiResponse<Specialty[]>> => {
  return httpClient.get<Specialty[]>('/specialties/');
};

// Get My Specialties (Provider)
export const getMySpecialties = async (token: string): Promise<ApiResponse<Specialty[]>> => {
  return httpClient.get<Specialty[]>(
    '/specialties/me',
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Add My Specialties (Provider)
export const addMySpecialties = async (
  specialties: string[],
  token: string
): Promise<ApiResponse<Specialty[]>> => {
  return httpClient.post<Specialty[]>(
    '/specialties/me',
    { specialties },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Remove My Specialty (Provider)
export const removeMySpecialty = async (
  specialtyId: string,
  token: string
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(
    `/specialties/me/${specialtyId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Delete Specialty (Admin)
export const deleteSpecialty = async (
  id: string,
  token: string
): Promise<ApiResponse<null>> => {
  return httpClient.delete<null>(
    `/specialties/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
