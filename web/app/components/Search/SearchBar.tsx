"use client";
import React from "react";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input
          type="text"
          aria-label="search"
          placeholder="pesquise..."
          className={styles.searchBar}
          onChange={handleChange}
        />
        <Search size={20} className={styles.icon} />
      </div>
    </div>
  );
}