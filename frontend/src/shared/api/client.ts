import axios from 'axios';
import { APP_CONFIG, STORAGE_KEYS } from '@/shared/config/constants';

const BASE_URL = APP_CONFIG.API_URL;

export const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor: Inject Token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            // Dispatch unauthorized event instead of direct redirect
            // This allows the app to handle it gracefully (e.g. show toast, redirect via router)
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }

        // Standardize error object
        const apiError = error.response?.data?.error || {
            code: String(error.response?.status || 'UNKNOWN'),
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        };

        return Promise.reject(apiError);
    }
);

