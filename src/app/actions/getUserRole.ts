"use server";

import { jwtUtils } from "@/lib/jwtUtils";
import { cookies } from "next/headers";

export async function getUserRoleFromServer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    if (token) {
       const decoded = jwtUtils.decodedToken(token);
       return (decoded?.role as string) || "USER";
    }
    return "USER";
  } catch(e) {
    return "USER";
  }
}
