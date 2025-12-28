"use client";
import { useState, useEffect } from "react";
import { useGetElements } from "@/app/hooks/admin/useGetElements";
import { PlusCircle } from "lucide-react";
import Elements from "./Elements";
import CreateItem from "./Items/CreateUpdateItem";
import styles from "./Table.module.css";

export type Section = "item" | "theme" | "service";

interface TableProps {
  actualSection: Section;
}

export default function Table({ actualSection }: TableProps) {
  const { elements, refetch, loading } = useGetElements(actualSection);
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
        elements={elements}
        refetch={refetch}
        loading={loading}
        />
      </div>

      {createOpen && actualSection === "item" && (
        <div className={styles.overlay} >
          <CreateItem
          closePopup={() => setCreateOpen(false)}
          refetch={refetch}
          />
        </div>
      )}
    </div>
  )
};