import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
    (config) => {
        console.log(`API Call: ${config.method?.toUpperCase()} ${config.url}`);
        const token = Cookies.get('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register') || error.config?.url?.includes('/auth/verify-otp');
        if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
            // Handle unauthorized (logout, redirect, etc.) for protected endpoints
            Cookies.remove('token');
            if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
