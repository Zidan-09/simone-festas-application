"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Search, Filter } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchProps {
  page: "themes" | "catalog";
  filterOpen?: boolean;
  setFilterOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function SearchBar({ page, filterOpen, setFilterOpen }: SearchProps) {
  
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input
        type="text"
        aria-label="search"
        placeholder="pesquise..."
        className={styles.searchBar}
        />
        <Search
        size={20}
        className={styles.icon}
        />
      </div>

      {page === "catalog" && (
        <div
        className={filterOpen ? styles.selected : styles.filter}
        onClick={() => setFilterOpen!(!filterOpen)}
        >
          <Filter
          size={20}
          className={styles.icon}
          />
          <span>Filtro</span>
        </div>
      )}
    </div>
  )
}