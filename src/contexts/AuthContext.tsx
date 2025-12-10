// src/contexts/AuthContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { User } from "@/src/utils/types";
import { api } from "@/src/configs/api";

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    startActivityListener: () => void;
    stopActivityListener: () => void;
    refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_THROTTLE_MS = 5 * 60 * 1000;
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // refs to manage listener state, throttle, and inactivity timeout
    const isListeningRef = useRef(false);
    const lastRefreshRef = useRef(0);
    const lastActivityRef = useRef(Date.now());
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const activityHandlerRef = useRef<() => void>(() => {});

    // Initialize from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem("auth_token");
                const storedUser = localStorage.getItem("auth_user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to restore auth session:", error);
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        lastActivityRef.current = Date.now();
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
    }, []);

    const isAuthenticated = !!token && !!user;

    /**
     * refreshToken - calls the backend refresh endpoint and updates token if successful
     */
    const refreshToken = useCallback(async (): Promise<string | null> => {
        if (!token) return null;

        try {
            const response = await api.post(
                "/auth/token",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newToken =
                response?.data?.token ?? response?.data?.data?.token ?? null;

            if (newToken) {
                setToken(newToken);
                localStorage.setItem("auth_token", newToken);
                return newToken;
            } else {
                console.warn("Refresh response did not contain a token:", response?.data);
                return null;
            }
        } catch (err) {
            console.error("Failed to refresh token:", err);
            // Don't logout on failed refresh - only logout on inactivity timeout
            return null;
        }
    }, [token]);

    /**
     * resetInactivityTimeout - resets the inactivity timer on user activity
     */
    const resetInactivityTimeout = useCallback(() => {
        // Clear existing timeout
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        // Set new timeout - logout if no activity for 30 minutes
        inactivityTimeoutRef.current = setTimeout(() => {
            console.warn("User inactive for 30 minutes - logging out");
            logout();
        }, INACTIVITY_TIMEOUT_MS);
    }, [logout]);

    /**
     * internal function that runs on user activity; throttles refresh calls
     */
    const handleActivity = useCallback(async () => {
        if (!token) return;

        lastActivityRef.current = Date.now();
        resetInactivityTimeout();

        const now = Date.now();
        if (now - lastRefreshRef.current < REFRESH_THROTTLE_MS) {
            return;
        }
        lastRefreshRef.current = now;
        await refreshToken();
    }, [token, refreshToken, resetInactivityTimeout]);

    // Wire the handler ref
    useEffect(() => {
        activityHandlerRef.current = () => {
            void handleActivity();
        };
    }, [handleActivity]);

    /**
     * startActivityListener - adds event listeners to watch for user actions
     */
    const startActivityListener = useCallback(() => {
        if (isListeningRef.current) return;
        isListeningRef.current = true;

        const add = (el: EventTarget, name: string, handler: EventListenerOrEventListenerObject) =>
            el.addEventListener(name, handler);

        const remove = (el: EventTarget, name: string, handler: EventListenerOrEventListenerObject) =>
            el.removeEventListener(name, handler);

        const handler = () => activityHandlerRef.current();

        add(window, "mousemove", handler);
        add(window, "mousedown", handler);
        add(window, "keydown", handler);
        add(window, "scroll", handler);
        add(window, "touchstart", handler as EventListener);
        add(document, "visibilitychange", handler);

        (startActivityListener as any).__cleanup = () => {
            remove(window, "mousemove", handler);
            remove(window, "mousedown", handler);
            remove(window, "keydown", handler);
            remove(window, "scroll", handler);
            remove(window, "touchstart", handler as EventListener);
            remove(document, "visibilitychange", handler);
            isListeningRef.current = false;
        };
    }, []);

    /**
     * stopActivityListener - removes event listeners
     */
    const stopActivityListener = useCallback(() => {
        const cleanup = (startActivityListener as any).__cleanup;
        if (typeof cleanup === "function") {
            cleanup();
        } else {
            const handler = () => activityHandlerRef.current();
            window.removeEventListener("mousemove", handler);
            window.removeEventListener("mousedown", handler);
            window.removeEventListener("keydown", handler);
            window.removeEventListener("scroll", handler);
            window.removeEventListener("touchstart", handler as EventListener);
            document.removeEventListener("visibilitychange", handler);
            isListeningRef.current = false;
        }
    }, []);

    /**
     * Auto-start listener when we have a token
     */
    useEffect(() => {
        if (token && !isListeningRef.current) {
            startActivityListener();
            resetInactivityTimeout();
        }

        return () => {
            stopActivityListener();
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, [token, startActivityListener, stopActivityListener, resetInactivityTimeout]);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated,
                isLoading,
                startActivityListener,
                stopActivityListener,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}