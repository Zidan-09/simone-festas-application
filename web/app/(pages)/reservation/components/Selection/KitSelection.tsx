"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import Image from "next/image";
import type { EventKit, ItemFormated, KitType, Theme } from "@/app/types";
import TableSelectionCard from "../SelectionCards/Kit/TableSelectionCard";
import ThemeSelectionCard from "../SelectionCards/Kit/ThemeSelectionCard";
import SearchBar from "@/app/components/Search/SearchBar";
import Loading from "@/app/components/Loading/Loading";

import kitSimple from "@/app/assets/images/stitch.jpeg";
import kitCylinder from "@/app/assets/images/bobbie-goods.jpeg";

import config from "@/app/config-api.json";
import styles from "./KitSelection.module.css";

interface KitSelectionProps {
  setKitToSend: Dispatch<SetStateAction<EventKit>>;
  changeStep: Dispatch<SetStateAction<number>>;
}

export default function KitSelection({ setKitToSend, changeStep }: KitSelectionProps) {
  const { searching, search, results } = useSearch<Theme>(`${config.api_url}/theme/search`);
  const [kitType, setKitType] = useState<KitType>("SIMPLE");
  const [tables, setTables] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [tablesToSelect, setTablesToSelect] = useState<ItemFormated[]>([]);
  const [themesToSelect, setThemesToSelect] = useState<Theme[]>([]);

  useEffect(() => {
    setLoading(true);
    async function fetchElementsToSelect() {
      try {
        const res = await fetch(`${config.api_url}/kit?kitType=${kitType}`).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setThemesToSelect(res.data.themes);
        setTablesToSelect(res.data.tables);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchElementsToSelect();
  }, [kitType]);

  const handleNextStep = () => {
    setKitToSend({
      eventType: "KIT",
      kitType: kitType,
      tables: tables,
      theme: theme
    });

    changeStep(3);
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>

        <div className={styles.fieldWrapper}>
          <label
            htmlFor="kitType"
            className={styles.label}
          >
            Selecione o tipo de KIT
          </label>

          <div className={styles.kitTypeContainer}>
            <div className={`${styles.kitType} ${kitType === "SIMPLE" ? styles.kitTypeSelected : ""}`} onClick={() => setKitType("SIMPLE")}>
              <Image src={kitSimple} alt="kit-simple" className={styles.kitImage} />

              <h3 className={styles.kitTypeLabel}>Kit Simples</h3>
            </div>

            <div className={`${styles.kitType} ${kitType === "CYLINDER" ? styles.kitTypeSelected : ""}`} onClick={() => setKitType("CYLINDER")}>
              <Image src={kitCylinder} alt="kit-cylinder" className={styles.kitImage} />

              <h3 className={styles.kitTypeLabel}>Kit Cilindro</h3>
            </div>
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label
            htmlFor="kitTables"
            className={styles.label}
          >
            Selecione as mesas que acompanharão o KIT
          </label>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : ""}

          <div className={styles.tablesContainer}>
            {tablesToSelect.map((t, idx) => (
              <div key={idx} onClick={() => setTables(t.vid)}>
                <TableSelectionCard table={t} selected={tables} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <label
            htmlFor="kitTheme"
            className={styles.label}
          >
            Selecione o tema da sua festa
          </label>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : ""}

          <SearchBar onSearch={search} />

          <div className={styles.themesContainer}>
            {(searching ? results : themesToSelect).map((t, idx) => (
              <div key={idx} onClick={() => setTheme(t.id)}>
                <ThemeSelectionCard theme={t} selected={theme} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={() => changeStep(1)}
          >
            Voltar
          </button>

          <button
            className={`${styles.button} ${tables.trim() && theme.trim() ? styles.next : styles.disabled}`}
            disabled={!tables.trim() || !theme.trim()}
            onClick={handleNextStep}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}