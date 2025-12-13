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
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

type UnauthorizedCallback = () => void;
type ErrorCallback = (message: string) => void;

let isInterceptorSetup = false;

export const setupInterceptors = (onUnauthorized: UnauthorizedCallback, onError: ErrorCallback) => {
    if (isInterceptorSetup) return;
    isInterceptorSetup = true;

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                onUnauthorized();
            } else {
                // Standardize error object
                const apiError = error.response?.data?.error || {
                    code: String(status || 'UNKNOWN'),
                    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
                };

                // Call error callback for non-auth errors
                onError(apiError.message);
            }

            return Promise.reject(error); // Keep propagating error for local handling if needed
        }
    );
};


