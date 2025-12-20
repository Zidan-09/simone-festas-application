"use client";
import SearchBar from "@/app/components/Search/SearchBar";
import styles from "./Themes.module.css";

export default function Themes() {

  return (
    <main className={styles.container}>
      <SearchBar
      page="themes"
      />

      <section className={styles.hero}>

      </section>

      <section className={styles.kids}>

      </section>

      <section className={styles.events}>

      </section>

      <section className={styles.adults}>

      </section>

      <section className={styles.generics}>

      </section>
    </main>
  )
}