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
    // added functions to control listener
    startActivityListener: () => void;
    stopActivityListener: () => void;
    // optional: allow manual refresh trigger
    refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes - adjust as needed

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // refs to manage listener state and throttle
    const isListeningRef = useRef(false);
    const lastRefreshRef = useRef(0);
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
                // Clear invalid data
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
        // Store in localStorage for persistence
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    }, []);

    const isAuthenticated = !!token && !!user;

    /**
     * refreshToken - calls the backend refresh endpoint and updates token if successful
     * returns the new token string or null on failure
     */
    const refreshToken = useCallback(async (): Promise<string | null> => {
        if (!token) return null;

        try {
            // Adjust endpoint or payload as your backend expects
            const response = await api.post(
                "/auth/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Try a couple common shapes for new token
            const newToken =
                response?.data?.token ?? response?.data?.data?.token ?? null;

            if (newToken) {
                setToken(newToken);
                localStorage.setItem("auth_token", newToken);
                return newToken;
            } else {
                // no token in response -> treat as failure
                console.warn("Refresh response did not contain a token:", response?.data);
                return null;
            }
        } catch (err) {
            console.error("Failed to refresh token:", err);
            // Optional: auto-logout on failed refresh. Keep or remove as desired.
            logout();
            return null;
        }
    }, [token, logout]);

    /**
     * internal function that runs on user activity; throttles refresh calls
     */
    const handleActivity = useCallback(async () => {
        if (!token) return;
        const now = Date.now();
        if (now - lastRefreshRef.current < REFRESH_THROTTLE_MS) {
            // still within throttle window -> skip
            return;
        }
        lastRefreshRef.current = now;
        await refreshToken();
    }, [token, refreshToken]);

    // Wire the handler ref (so we can add/remove the same handler function)
    useEffect(() => {
        activityHandlerRef.current = () => {
            void handleActivity();
        };
    }, [handleActivity]);

    /**
     * startActivityListener - adds event listeners to watch for user actions
     * and triggers a token refresh (rate-limited).
     */
    const startActivityListener = useCallback(() => {
        if (isListeningRef.current) return;
        isListeningRef.current = true;

        const add = (el: EventTarget, name: string, handler: EventListenerOrEventListenerObject) =>
            el.addEventListener(name, handler);

        const remove = (el: EventTarget, name: string, handler: EventListenerOrEventListenerObject) =>
            el.removeEventListener(name, handler);

        const handler = () => activityHandlerRef.current();

        // common actions
        add(window, "mousemove", handler);
        add(window, "mousedown", handler);
        add(window, "keydown", handler);
        add(window, "scroll", handler);
        add(window, "touchstart", handler as EventListener);
        add(document, "visibilitychange", handler);

        // store a cleanup on the ref in case stop is called
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
            // fallback: try to remove using the same handler reference
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
     * Auto-start listener when we have a token. This is optional behavior.
     * If you prefer manual control, remove this effect and call startActivityListener yourself.
     */
    useEffect(() => {
        if (token && !isListeningRef.current) {
            startActivityListener();
        }

        // stop listener on logout/unmount
        return () => {
            stopActivityListener();
        };
    }, [token]);

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
