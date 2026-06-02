import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<{ email: string; msg: string }> {
        const response = await api.post<{ email: string; msg: string }>('/auth/register', data);
        return response.data;
    },

    async verifyOtp(data: { email: string; code: string; purpose: string }): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>('/auth/verify-otp', data);
        return response.data;
    },

    async forgotPassword(email: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(data: any): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>('/auth/reset-password', data);
        return response.data;
    },

    async getMe(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },
};
