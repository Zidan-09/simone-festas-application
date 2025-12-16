"use client";
import SearchBar from "@/app/components/Search/SearchBar";
import styles from "./Themes.module.css";

export default function Themes() {

  return (
    <main className={styles.container}>
      <SearchBar
      page="themes"
      />
    </main>
  )
}