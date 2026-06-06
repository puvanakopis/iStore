import api from "./api";
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    MessageResponse,
    VerifyOtpRequest,
} from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const res = await api.post<AuthResponse>("/auth/login", data);
        return res.data;
    },

    async register(data: RegisterRequest): Promise<MessageResponse> {
        const res = await api.post<MessageResponse>("/auth/register", data);
        return res.data;
    },

    async verifyOtp(data: VerifyOtpRequest): Promise<MessageResponse> {
        const res = await api.post<MessageResponse>("/auth/verify-otp", data);
        return res.data;
    },

    async forgotPassword(email: string): Promise<MessageResponse> {
        const res = await api.post<MessageResponse>("/auth/forgot-password", {
            email,
        });
        return res.data;
    },

    async resetPassword(data: {
        email: string;
        otp_code: string;
        new_password: string;
    }): Promise<MessageResponse> {
        const res = await api.post<MessageResponse>("/auth/reset-password", data);
        return res.data;
    },

    async getMe(): Promise<User> {
        const res = await api.get<User>("/auth/me");
        return res.data;
    },
};