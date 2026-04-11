import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { User, AuthResponse } from "../types";

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const token = await SecureStore.getItemAsync('jwt_token');
                const savedUsername = await SecureStore.getItemAsync('username');
                const savedUserId = await SecureStore.getItemAsync('userId');

                if (token && savedUsername && savedUserId) {
                    setUser({ username: savedUsername, userId: Number(savedUserId) });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do armazenamento:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadStorageData();
    }, []);

    async function login(username: string, password: string) {
        try {
            const response = await api.post<any>('/api/auth/login', { username, password });

            console.log("RESPOSTA DO JAVA:", response.data);

            const token = response.data.token || response.data.jwtToken || response.data.accessToken;
            const returnedUsername = response.data.username;
            const userId = response.data.userId;

            if (!token) {
                throw new Error("O Token não veio do servidor! Verifique o console log.");
            }

            await SecureStore.setItemAsync('jwt_token', token);
            await SecureStore.setItemAsync('username', returnedUsername);
            await SecureStore.setItemAsync('userId', String(userId));

            setUser({ userId, username: returnedUsername });

        } catch (error: any) {
            console.error("Erro no login:", error);
            throw new Error(error.response?.data?.message || error.message || 'Falha ao fazer login.');
        }
    }

    async function logout() {
        await SecureStore.deleteItemAsync('jwt_token');
        await SecureStore.deleteItemAsync('username');
        await SecureStore.deleteItemAsync('userId');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
    {children}
    </AuthContext.Provider>
);
};