"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import type { Bookmark } from "@/src/utils/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    createBookmark: (bookmarkData: {
        body: string;
        description: string;
        url: string;
    }) => Promise<Bookmark | undefined>;
}

const CreateBookmark = ({ open, onOpenChange, createBookmark }: Props) => {
    const [formData, setFormData] = useState({
        body: "",
        description: "",
        url: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!formData.body.trim()) {
            setError("Title is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.url.trim()) {
            setError("URL is required");
            setIsSubmitting(false);
            return;
        }

        try {
            await createBookmark({
                body: formData.body.trim(),
                url: formData.url.trim(),
                description: formData.description.trim(),
            });

            setFormData({ body: "", description: "", url: "" });
            onOpenChange(false);
        } catch (err) {
            setError("Failed to create bookmark. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => onOpenChange(false)}>
            <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-[#023a3a] font-semibold">Create New Bookmark</h2>
                    <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input id="body" name="body" type="text" value={formData.body} onChange={handleInputChange} placeholder="Enter bookmark title" className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL <span className="text-red-500">*</span></label>
                        <input id="url" name="url" type="url" value={formData.url} onChange={handleInputChange} placeholder="https://example.com" className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Add a description (optional)" className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none" />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition disabled:opacity-50">Cancel</button>

                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#056760] text-white rounded-md hover:bg-[#045d55] transition disabled:opacity-50">
                            {isSubmitting ? "Saving..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookmark;