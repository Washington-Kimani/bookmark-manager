"use client";

import {useBookmarks} from "@/src/hooks/useBookmarks";
import {useAuth} from "@/src/contexts/AuthContext";
import {useEffect, useState} from "react";
import Loading from "@/src/components/layout/loading";
import {toast} from "sonner";
import {Archive, Calendar, ExternalLink, Eye, Flag, MoreVertical, Search, Trash2} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const ArchivedPage = () => {
    const {token} = useAuth();
    const {
        bookmarks,
        fetchArchivedBookmarks,
        deleteBookmark,
        loading: bookmarksLoading,
        error
    } = useBookmarks(token);

    // states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"recent" | "oldest" | "alphabetical">(
        "recent"
    );
    const [openMenuId, setOpenMenuId] = useState<number | null>();

    // fetch archived bookmarks on component mount
    useEffect(() => {
        if (token)  {
            fetchArchivedBookmarks();
        }
    }, [token]);

    // filter bookmarks
    const filteredBookmarks = bookmarks.filter(bookmark=>
        bookmark.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // sort bookmarks
    const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
        switch (sortBy) {
            case "oldest":
                return (
                    new Date(a.created_at || 0).getTime() -
                    new Date(b.created_at || 0).getTime()
                );
            case "alphabetical":
                return a.body.localeCompare(b.body);
            case "recent":
            default:
                return (
                    new Date(b.created_at || 0).getTime() -
                    new Date(a.created_at || 0).getTime()
                );
        }
    });

    // format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
        });
    };

    const handleDeleteBookmark = async (id: number) => {
        await deleteBookmark(id);
        setOpenMenuId(null);
    };

    const handleCopyUrl = async (url: string) => {
        await navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };


    // show loading
    if(bookmarksLoading) {
        return <Loading />;
    }

    // show error state
    if (error) {
        return (
            <section className="w-full h-screen flex items-center justify-center">
                <div className="w-11/12 lg:w-1/2 text-center">
                    <div className="mb-4 p-4 bg-[#343940] border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={() => fetchArchivedBookmarks()}
                        className="px-4 py-2 bg-[#056760] text-white rounded-md hover:bg-[#045d55] transition"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    // show empty state
    if (bookmarks.length === 0 && !bookmarksLoading) {
        return (
            <section className="w-full h-screen flex items-center justify-center p-4">
                <div className="w-full lg:w-1/2 text-center">
                    <div className="mb-6 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            No archived bookmarks yet!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Go back to the <Link href="/bookmarks" className={"text-emerald-400"}>bookmarks</Link> page.
                        </p>
                    </div>
                </div>

            </section>
        );
    }
    return (
        <article className="relative h-[95vh] bg-[#343940] my-6 mx-6 z-0 rounded-lg overflow-y-auto">
            <div className="flex-1 w-full h-full overflow-auto p-4 md:p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <h1 className="text-3xl text-white font-bold">Archived Bookmarks</h1>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search bookmarks by title, URL, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#056760] focus:border-transparent transition bg-white text-gray-900"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#056760] focus:border-transparent transition bg-white cursor-pointer text-gray-900"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A - Z</option>
                        </select>
                    </div>

                    {/* Search Results Count */}
                    {searchQuery && (
                        <p className="text-sm text-gray-500 mt-2">
                            Found {sortedBookmarks.length} bookmark
                            {sortedBookmarks.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                {/* Bookmarks Grid */}
                {sortedBookmarks.length === 0 ? (
                    <div className="text-center py-12">
                        <Search size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
                            {`No bookmarks found matching ${searchQuery}`}
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-[#056760] font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {sortedBookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="bg-[#e5e5e6] rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow duration-200 hover:border-gray-300"
                            >
                                {/* Header with icon and menu */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                            {bookmark.icon_url ? (
                                                <Image
                                                    width={30}
                                                    height={30}
                                                    src={bookmark.icon_url}
                                                    alt={bookmark.body}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                                    {bookmark.body.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {bookmark.body}
                                            </h3>
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/${bookmark.short_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:text-blue-800 truncate flex items-center gap-1 hover:underline"
                                            >
                                                <span className="truncate">{bookmark.url}</span>
                                                <ExternalLink size={12} className="flex-shrink-0" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Menu Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === bookmark?.id ? null : bookmark?.id
                                                )
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 transition"
                                        >
                                            <MoreVertical size={18} className="text-gray-400" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenuId === bookmark.id && (
                                            <div
                                                className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <a
                                                    href={bookmark.short_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                                                >
                                                    <ExternalLink size={16} />
                                                    Open Link
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        handleCopyUrl(bookmark.url);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left border-b border-gray-200"
                                                >
                                                    📋 Copy URL
                                                </button>
                                                <button onClick={()=>archiveBookmark(bookmark.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left border-b border-gray-200">
                                                    <Archive size={16} />
                                                    Archive
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBookmark(bookmark.id)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {bookmark.description || "No description provided"}
                                </p>

                                {/* Footer with metadata */}
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 border-t border-gray-200 pt-4">
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} />
                                        <span>{bookmark?.visit || 0} views</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(bookmark.created_at)}</span>
                                    </div>
                                    <button className="ml-auto p-1 hover:bg-gray-100 rounded transition">
                                        <Flag size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </article>
    )
}

export default ArchivedPage;