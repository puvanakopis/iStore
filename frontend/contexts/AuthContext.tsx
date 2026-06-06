"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";
import { LoginRequest, RegisterRequest } from "../interfaces/auth.interface";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;

    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const init = async () => {
            const token = Cookies.get("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const me = await authService.getMe();
                setUser(me);
            } catch {
                Cookies.remove("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const login = async (data: LoginRequest) => {
        const res = await authService.login(data);

        Cookies.set("token", res.access_token, {
            expires: 7,
            secure: true,
            sameSite: "strict",
        });

        setUser(res.user);
        router.push("/");
    };

    const register = async (data: RegisterRequest) => {
        await authService.register(data);

        // IMPORTANT: no token here
        router.push("/verify-otp?email=" + data.email);
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/signin");
    };

    const updateProfile = async (data: Partial<User>) => {
        const updated = await authService.updateMe(data);
        setUser(updated);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, isAdmin, login, register, logout, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};