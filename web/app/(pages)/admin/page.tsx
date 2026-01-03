"use client";
import { useState } from "react";
import type { Section } from "./components/Table";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./components/Table";
import styles from "./Admin.module.css";

export default function Admin() {
  const [actualSection, setActualSection] = useState<Section>("item");

  return (
    <main className={styles.container}>
      <Sidebar
      actualSection={actualSection}
      setActualSection={setActualSection}
      />
      <Table actualSection={actualSection} />
    </main>
  ) 
}