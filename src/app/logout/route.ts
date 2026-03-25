import { logoutApiResponse } from "@/services/auth.service";

export async function POST() {
  return logoutApiResponse();
}
