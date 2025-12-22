"use client";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import styles from "./Table.module.css";
import CreateItem from "./Items/create/CreateItem";
import CreateVariant from "./Items/create/CreateVariant";

interface TableProps {
  actualSection: string;
}

export default function Table({ actualSection }: TableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCreateOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
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
        {actualSection}
        {`${createOpen}`}
      </div>

      {createOpen && actualSection === "items" && (
        <div className={styles.overlay} >
          <CreateItem closePopup={() => setCreateOpen(false)} />
        </div>
      )}
    </div>
  )
};