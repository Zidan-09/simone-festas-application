"use client";
import { useState } from "react";
import SearchBar from "@/app/components/Search/SearchBar";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleCloseFilter = () => {
    if (filterOpen) setFilterOpen(!filterOpen);
  }

  return (
    <div className={styles.container} onClick={handleCloseFilter}>
      <SearchBar
      page="catalog"
      filterOpen={filterOpen}
      setFilterOpen={setFilterOpen}
      />
    </div>
  )
}