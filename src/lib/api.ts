import {api} from "@/src/configs/api";
import {AxiosError} from "axios";
import {User} from "@/src/utils/types";
import {authService} from "@/src/lib/auth";

const handleApiError = (error: AxiosError) => {
    if (error.response?.status === 401) {
        authService.clearAuth();
    }
    throw error;
};

export const usersApi = {
    // create new user aka register
    createUser: async (user: User) => {
        try {
            const response = await api.post("/auth/register", user);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // get all users
    getAllUsers: async (): Promise<User[] | null> => {
        try {
            const response = await api.get('/users', {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    },

    // get one user
    getUserById: async (id: number): Promise<User | null> => {
        try {
            const response = await api.get(`/users/${id}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    }
}