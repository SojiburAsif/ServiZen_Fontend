import { ApiResponse } from '@/types/api.types';
import { ApiRequestOptions } from '@/types/axios.interface';
import axios from 'axios';
import { env } from '../env';

const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

const logHttpError = (method: string, endpoint: string, error: unknown) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const payload = error.response?.data as { message?: string; error?: string } | undefined;
        const apiMessage = payload?.error || payload?.message;
        const fallback = error.message || 'Unknown error';
        console.error(`${method} ${endpoint} failed${status ? ` (${status})` : ''}: ${apiMessage || fallback}`);
        return;
    }

    console.error(`${method} ${endpoint} failed:`, error);
};

const axiosInstance = () => {
    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        withCredentials: true,
        headers:{
            'Content-Type' : 'application/json',
        }
    })

    return instance;
}


const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {     
        const instance = axiosInstance();   
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {       
        logHttpError('GET', endpoint, error);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        logHttpError('POST', endpoint, error);
        throw error;
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        logHttpError('PUT', endpoint, error);
        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        logHttpError('PATCH', endpoint, error);
        throw error;
    }
}

const httpDelete =  async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        logHttpError('DELETE', endpoint, error);
        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
}