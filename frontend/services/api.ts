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
        if (error.response?.status === 401) {
            // Handle unauthorized (logout, redirect, etc.)
            Cookies.remove('token');
            // if (typeof window !== 'undefined') window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;
