"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { productService } from "../services/product.service";
import { SearchResult } from "../interfaces/product.interface";

interface SearchContextType {
    searchQuery: string;
    searchResults: SearchResult[];
    isSearching: boolean;
    recentSearches: string[];
    popularSearches: string[];
    performSearch: (query: string) => Promise<void>;
    clearSearch: () => void;
    addToRecentSearches: (query: string) => void;
    clearRecentSearches: () => void;
    removeRecentSearch: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const POPULAR_SEARCHES = [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 15 Pro",
    "iPhone 14 Pro Max",
];
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const addToRecentSearches = useCallback((query: string) => {
        if (!query.trim()) return;
        setRecentSearches(prev => {
            const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
            localStorage.setItem("recentSearches", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    }, []);

    const removeRecentSearch = useCallback((query: string) => {
        setRecentSearches(prev => {
            const updated = prev.filter(s => s !== query);
            localStorage.setItem("recentSearches", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchQuery(query);

        try {
            const response = await productService.search(query);
            setSearchResults(response.results);
            addToRecentSearches(query);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [addToRecentSearches]);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setSearchResults([]);
    }, []);

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                searchResults,
                isSearching,
                recentSearches,
                popularSearches: POPULAR_SEARCHES,
                performSearch,
                clearSearch,
                addToRecentSearches,
                clearRecentSearches,
                removeRecentSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be used within SearchProvider");
    return ctx;
};