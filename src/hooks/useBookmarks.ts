"use client";

import { useReducer, useCallback } from "react";
import { api } from "@/src/configs/api";
import { toast } from "sonner";

export type Bookmark = {
    id?: number;
    body: string;
    description: string;
    url: string;
    icon_url?: string;
    short_url?: string;
    visits: number;
    created_at: string;
    updated_at: string;
};

interface BookmarkState {
    bookmarks: Bookmark[];
    loading: boolean;
    error: string | null;
}

type BookmarkAction =
    | { type: "SET_BOOKMARKS"; payload: Bookmark[] }
    | { type: "ADD_BOOKMARK"; payload: Bookmark }
    | { type: "UPDATE_BOOKMARK"; payload: Bookmark }
    | { type: "DELETE_BOOKMARK"; payload: number }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

const initialState: BookmarkState = {
    bookmarks: [],
    loading: false,
    error: null,
};

function bookmarkReducer(
    state: BookmarkState,
    action: BookmarkAction
): BookmarkState {
    switch (action.type) {
        case "SET_BOOKMARKS":
            return {
                ...state,
                bookmarks: action.payload,
                loading: false,
                error: null,
            };
        case "ADD_BOOKMARK":
            return {
                ...state,
                // Add new bookmark to top of list
                bookmarks: [action.payload, ...state.bookmarks],
                error: null,
            };
        case "UPDATE_BOOKMARK":
            return {
                ...state,
                bookmarks: state.bookmarks.map((b) =>
                    b.id === action.payload.id ? action.payload : b
                ),
                error: null,
            };
        case "DELETE_BOOKMARK":
            return {
                ...state,
                // keep everything except the bookmark with the passed id
                bookmarks: state.bookmarks.filter((b) => b.id !== action.payload),
                error: null,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
}

export function useBookmarks(token: string | null) {
    const [state, dispatch] = useReducer(bookmarkReducer, initialState);

    const fetchBookmarks = useCallback(async () => {
        if (!token) return;
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await api.get("/bookmarks", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // assumes API returns { data: { data: Bookmark[] } }
            dispatch({ type: "SET_BOOKMARKS", payload: response.data.data });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: `Failed to fetch bookmarks ${error}`,
            });
        }
    }, [token]);

    const createBookmark = useCallback(
        async (bookmarkData: Omit<Bookmark, "id" | "created_at" | "updated_at">) => {
            if (!token) {
                dispatch({ type: "SET_ERROR", payload: "Not Authenticated" });
                return;
            }

            try {
                const response = await api.post("/bookmarks", bookmarkData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // assume created bookmark is at response.data.data (single object)
                const newBookmark: Bookmark = response.data.data;
                dispatch({ type: "ADD_BOOKMARK", payload: newBookmark });
                toast.success("Bookmark created successfully");
                return newBookmark;
            } catch (error) {
                const errorMsg = `Failed to create bookmark: ${error}`;
                dispatch({ type: "SET_ERROR", payload: errorMsg });
                toast.error(errorMsg);
            }
        },
        [token]
    );

    const updateBookmark = useCallback(
        async (id: number, bookmarkData: Partial<Bookmark>) => {
            if (!token) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Not Authenticated",
                });
                return;
            }

            try {
                const response = await api.put(`/bookmarks/${id}`, bookmarkData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // assume updated bookmark is at response.data.data
                const updatedBookmark: Bookmark = response.data.data;
                dispatch({ type: "UPDATE_BOOKMARK", payload: updatedBookmark });
                toast.success("Bookmark updated successfully");
                return updatedBookmark;
            } catch (error) {
                const errorMsg = `Failed to update bookmark: ${error}`;
                dispatch({ type: "SET_ERROR", payload: errorMsg });
                toast.error(errorMsg);
            }
        },
        [token]
    );

    const deleteBookmark = useCallback(
        async (id: number) => {
            if (!token) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Not authenticated",
                });
                return;
            }
            try {
                await api.delete(`/bookmarks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch({ type: "DELETE_BOOKMARK", payload: id });
                toast.success("Bookmark deleted successfully");
            } catch (error) {
                const errorMsg = `Failed to delete bookmark: ${error}`;
                dispatch({ type: "SET_ERROR", payload: errorMsg });
                toast.error(errorMsg);
            }
        },
        [token]
    );

    return {
        ...state,
        fetchBookmarks,
        createBookmark,
        updateBookmark,
        deleteBookmark,
    };
}