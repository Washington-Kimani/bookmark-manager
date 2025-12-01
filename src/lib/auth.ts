import { User } from '@/src/utils/types';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export class AuthService {
    private static instance: AuthService;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    getAuthState(): AuthState {
        try {
            if(typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                return {
                    user: user,
                    token: token,
                    isAuthenticated: !!token && !!user,
                };
            } else {
                return {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }
            }
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return {
                user: null,
                token: null,
                isAuthenticated: false,
            };
        }
    }

    public setAuth(token: string, user: User) {
        console.log(`Setting auth data: ${JSON.stringify(token)}`);
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem('access_token', token);
                window.localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        }
    }

    public clearAuth() {
        console.log(`Clearing auth data`);
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem('access_token');
                window.localStorage.removeItem('user');
            } catch (e) {
                console.error('Error clearing localStorage:', e);
            }
        }
    }

    public getAuthHeader() {
        const token = localStorage.getItem('access_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    public isAuthenticated(): boolean {
        const { token, user } = this.getAuthState();
        return !!token && !!user;
    }

    public getUser(): User | null {
        const { user } = this.getAuthState();
        return user;
    }

    public getToken(): string | null {
        const { token } = this.getAuthState();
        return token;
    }
}

export const authService = AuthService.getInstance();