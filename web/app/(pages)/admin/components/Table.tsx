"use client";
import { useState, useEffect } from "react";
import { useGetElements } from "@/app/hooks/admin/useGetElements";
import { PlusCircle } from "lucide-react";
import Elements from "./Elements";
import CreateUpdateItem from "./Items/CreateUpdateItem";
import CreateUpdateTheme from "./themes/CreateUpdateTheme";
import CreateUpdateService from "./services/CreateUpdateService";
import styles from "./Table.module.css";

export type Section = "item" | "theme" | "service";

const createComponentMap = {
  item: CreateUpdateItem,
  theme: CreateUpdateTheme,
  service: CreateUpdateService
};

interface TableProps {
  actualSection: Section;
}

export default function Table({ actualSection }: TableProps) {
  const { elements, refetch, loading } = useGetElements(actualSection);
  const [createOpen, setCreateOpen] = useState(false);
  const CreateComponent = createComponentMap[actualSection];

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

      {createOpen && CreateComponent && (
        <div className={styles.overlay} >
          <CreateComponent
          onClose={() => setCreateOpen(false)}
          refetch={refetch}
          />
        </div>
      )}
    </div>
  )
};