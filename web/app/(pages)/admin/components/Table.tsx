"use client";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import styles from "./Table.module.css";
import CreateItem from "./Items/create/CreateItem";
import Elements from "./Elements";

interface TableProps {
  actualSection: string;
}

export default function Table({ actualSection }: TableProps) {
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCreateOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <button
        type="button"
        className={styles.button}
        onClick={() => setCreateOpen(!createOpen)}
        >
          <PlusCircle size={20} />
          Cadastrar
        </button>
      </div>

      <div className={styles.table}>
        <Elements
        actualSection={actualSection}
        />
      </div>

      {createOpen && actualSection === "item" && (
        <div className={styles.overlay} >
          <CreateItem closePopup={() => setCreateOpen(false)} />
        </div>
      )}
    </div>
  )
};