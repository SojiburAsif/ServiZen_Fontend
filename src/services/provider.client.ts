import { httpClient } from "@/lib/axios/httpClient";
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

export const updateProviderProfile = async (
  payload: UpdateProviderProfilePayload,
  token?: string | null,
): Promise<ApiResponse<ProviderSelfProfile>> => {
  return httpClient.patch<ProviderSelfProfile>("/providers/me", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
