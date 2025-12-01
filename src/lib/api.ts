import {api} from "@/src/configs/api";
import {AxiosError} from "axios";
import {User, Bookmark} from "@/src/utils/types";
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


export  const bookmarksApi = {
    // get all bookmarks
    async getBookmarks(): Promise<Bookmark[]> {
        try {
            const response = await api.get("/bookmarks", {
                headers: authService.getAuthHeader(),
            });
            return response.data.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return [];
        }
    },

    // get bookmark by id
    getBookmarkById: async (id: number): Promise<Bookmark | null> => {
        try {
            const response = await api.get(`/bookmarks/${id}`, {
                headers: authService.getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    },

    // create a new bookmark
    createBookmark: async (bookmark: Bookmark): Promise<Bookmark | null> => {
        try {
            const response = await api.post(`/bookmarks`, bookmark, {
                headers: authService.getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    },

    // update a bookmark
    updateBookmark: async (id: number, bookmark: Bookmark): Promise<Bookmark | null> => {
        try {
            const response = await api.post(`/bookmarks/${id}`, bookmark, {
                headers: authService.getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    },

    // delete a bookmark
    deleteBookmark: async (id: number): Promise<null> => {
        try {
            const response = await api.delete(`/bookmarks/${id}`, {
                headers: authService.getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError);
            return null;
        }
    },
}