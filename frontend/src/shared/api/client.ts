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
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }

        // Standardize error object
        const apiError = error.response?.data?.error || {
            code: String(error.response?.status || 'UNKNOWN'),
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        };

        // Dispatch generic generic error event for global toast
        if (typeof window !== 'undefined' && error.response?.status !== 401 && error.response?.status !== 403) {
            const event = new CustomEvent('api:error', { detail: { message: apiError.message } });
            window.dispatchEvent(event);
        }

        return Promise.reject(apiError);
    }
);


