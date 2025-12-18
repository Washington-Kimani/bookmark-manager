"use client";

import { useReducer, useCallback } from "react";
import { api } from "@/src/configs/api";
import { toast } from "sonner";
import {Bookmark} from "@/src/utils/types";

interface BookmarkState {
    bookmarks: Bookmark[];
    loading: boolean;
    error: string | null;
}

type BookmarkAction =
    | { type: "SET_BOOKMARKS"; payload: Bookmark[] }
    | { type: "ADD_BOOKMARK"; payload: Bookmark }
    | { type: "UPDATE_BOOKMARK"; payload: Bookmark }
    | { type: "ARCHIVE_BOOKMARK"; payload: number }
    | { type: "UPSERT_BOOKMARK"; payload: Bookmark }
    | { type: "DELETE_BOOKMARK"; payload: number }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

const initialState: BookmarkState = {
    bookmarks: [],
    loading: true,
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
        case "ARCHIVE_BOOKMARK":
            return {
                ...state,
                bookmarks: state.bookmarks.filter(b => b.id !== action.payload),
            };
        case "UPSERT_BOOKMARK":
            const exists = state.bookmarks.map(b => b.id === action.payload?.id);

            return {
                ...state,
                bookmarks: exists
                    ? state.bookmarks.map(b =>
                        b.id === action.payload?.id ? action.payload : b
                    )
                    : [action.payload, ...state.bookmarks],
            };
        case "DELETE_BOOKMARK":
            return {
                ...state,
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

            // handle different data formats
            const bookmarksData = response.data.data || response.data;
            const bookmarks = Array.isArray(bookmarksData) ? bookmarksData : [bookmarksData];
            dispatch({ type: "SET_BOOKMARKS", payload: bookmarks });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            dispatch({
                type: "SET_ERROR",
                payload: `Failed to fetch bookmarks: ${errorMsg}`,
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

    const fetchArchivedBookmarks = useCallback(async () => {
        if (!token) {
            dispatch({
                type: "SET_ERROR",
                payload: "Not authenticated",
            });
            return;
        }

        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await api.get("/bookmarks/archived", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // assumes API returns { data: { data: Bookmark[] } }
            dispatch({ type: "SET_BOOKMARKS", payload: response.data.data });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: `Failed to fetch archived bookmarks ${error}`,
            });
        }
    }, [token]);

    const archiveBookmark = useCallback(
        async (id: number, archived: boolean) => {
            if (!token) return;

            try {
                const response = await api.put(
                    `/bookmarks/${id}/archive`,
                    { archived },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updatedBookmark: Bookmark = response.data.data;

                if (archived) {
                    // remove from active list
                    dispatch({ type: "ARCHIVE_BOOKMARK", payload: id });
                } else {
                    // automatically re-add to active list
                    dispatch({
                        type: "SET_BOOKMARKS",
                        payload: [updatedBookmark],
                    });
                }

                toast.success(
                    archived
                        ? "Bookmark archived"
                        : "Bookmark restored"
                );

                return updatedBookmark;
            } catch (error) {
                toast.error("Failed to update bookmark");
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
    )

    return {
        ...state,
        fetchBookmarks,
        createBookmark,
        updateBookmark,
        archiveBookmark,
        fetchArchivedBookmarks,
        deleteBookmark,
    };
}