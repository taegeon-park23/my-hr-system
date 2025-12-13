import { client } from './client';
import { ApiResponse, PaginatedResponse } from '@/shared/model/types';

// Generic fetcher for SWR/TanStack Query
export const fetcher = async <T>(url: string): Promise<T> => {
    const response = await client.get<ApiResponse<T>>(url);
    if (!response.data.success) {
        throw response.data.error || new Error('API request failed');
    }
    return response.data.data;
};

// Fetcher specifically for paginated lists if API structure differs or needs transformation
// Assuming standard API returns Envelope with data inside
export const fetcherPaginated = async <T>(url: string): Promise<PaginatedResponse<T>> => {
    const response = await client.get<ApiResponse<PaginatedResponse<T>>>(url);
    if (!response.data.success) {
        throw response.data.error || new Error('API request failed');
    }
    return response.data.data;
};
