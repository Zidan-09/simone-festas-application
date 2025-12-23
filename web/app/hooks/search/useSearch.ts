"use client";
import { useState } from "react";

export function useSearch<T>(endpoint: string) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<T[]>([]);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearching(false);
      setResults([]);
      return;
    }

    setSearching(true);

    const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    setResults(data.data ?? data);
  };

  return {
    searching,
    results,
    search,
  };
}
