import { env } from './env';

export const APP_CONFIG = {
    API_URL: env.NEXT_PUBLIC_API_URL,
    APP_NAME: 'Next-Gen HR System',
    DEFAULT_PAGE_SIZE: 10,
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    CURRENT_YEAR: new Date().getFullYear(),
};

export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PAYROLL: '/payroll',
    VACATION: '/vacation',
    ADMIN: '/admin',
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    THEME: 'theme',
};
