'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/lib/auth';
import type { User } from '@/src/utils/types';
import { toast } from 'sonner';
import { usersApi } from '@/src/lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    tempToken?: string | null;
}

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_MINUTES = 30;
let timeoutId: NodeJS.Timeout | null = null;

function resetSessionTimeout(logout: () => void) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        logout();
        toast.info('Session expired, please log in again.');
    }, SESSION_TIMEOUT_MINUTES * 60 * 1000);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>(() => {
        return {
            user: authService.getUser(),
            token: authService.getToken(),
            isAuthenticated: authService.isAuthenticated(),
            tempToken: null,
        };
    });
    const router = useRouter();

    useEffect(() => {
        setAuthState({
            user: authService.getUser(),
            token: authService.getToken(),
            isAuthenticated: authService.isAuthenticated(),
            tempToken: null,
        });
    }, []);

    useEffect(() => {
        if (authState.isAuthenticated) {
            const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
            const activityHandler = () => resetSessionTimeout(logout);
            events.forEach(event => window.addEventListener(event, activityHandler));
            resetSessionTimeout(logout);
            return () => {
                if (timeoutId) clearTimeout(timeoutId);
                events.forEach(event => window.removeEventListener(event, activityHandler));
            };
        } else {
            if (timeoutId) clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isAuthenticated]);

    const login = async (token: string, user: User) => {
        authService.setAuth(token, user);
        // Fetch the full user profile (with profilePicUrl) after login
        let fullUser = user;
        try {
            const fetched = await usersApi.getUserById(user.id);
            if (fetched) fullUser = fetched;
            console.log(fullUser);
        } catch (e) {
            // fallback to original user if fetch fails
        }
        setAuthState({
            user: fullUser,
            token,
            isAuthenticated: true,
            tempToken: null,
        });
    };

    const logout = () => {
        authService.clearAuth();
        setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            tempToken: null,
        });
        router.push('/login');
    };

    const setTempToken = (token: string) => {
        setAuthState(prev => ({
            ...prev,
            tempToken: token,
        }));
    };

    const clearTempToken = () => {
        setAuthState(prev => ({
            ...prev,
            tempToken: null,
        }));
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout,
            setTempToken,
            clearTempToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 