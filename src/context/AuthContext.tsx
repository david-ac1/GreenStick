'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: string | null;
    login: (apiKey: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth');
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
            setUser(data.user || null);
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (apiKey: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey }),
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            setIsAuthenticated(data.authenticated);
            setUser(data.user || 'OPERATOR');
            return true;
        } catch {
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
    }, [router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
