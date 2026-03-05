 import { httpClient } from "@/lib/axios/httpClient";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await httpClient.post("/auth/login", credentials);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
    },  
    logout: async () => {
        try {
            const response = await httpClient.post("/auth/logout", {});
            return response;
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    },
    register: async (userData: { name: string; email: string; password: string }) => {
        try {   
            const response = await httpClient.post("/auth/register", userData);
            return response;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }   
    },
    refreshToken: async () => {
        try {       
            const response = await httpClient.post("/auth/refresh-token", {});
            return response;
        } catch (error) {
            console.error("Token refresh failed:", error);
            throw error;
        }       
    },
        getCurrentUser: async () => {
            try {       
                const response = await httpClient.get("/auth/me");
                return response;
            } catch (error) {
                console.error("Fetching current user failed:", error);
                throw error;
            }   
        },
    };          
        
    
