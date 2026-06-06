'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../interfaces/user.interface';
import { authService } from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../interfaces/auth.interface';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    Cookies.remove('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const { access_token, user } = await authService.login(data);
            Cookies.set('token', access_token, { expires: 7, secure: true, sameSite: 'strict' });
            setUser(user);
            router.push('/');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const { access_token, user } = await authService.register(data);
            Cookies.set('token', access_token, { expires: 7, secure: true, sameSite: 'strict' });
            setUser(user);
            router.push('/');
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/signin');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
