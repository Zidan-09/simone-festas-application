"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import type { EventKit, ItemFormated, KitType, Theme } from "@/app/types";
import TableSelectionCard from "../SelectionCards/TableSelectionCard";

import kitSimple from "@/app/assets/images/stitch.jpeg";
import kitCylinder from "@/app/assets/images/bobbie-goods.jpeg";

import config from "@/app/config-api.json";
import styles from "./KitSelection.module.css";
import ThemeSelectionCard from "../SelectionCards/ThemeSelectionCard";

interface KitSelectionProps {
  kitToSend: EventKit;
  setKitToSend: Dispatch<SetStateAction<EventKit>>;
}

export default function KitSelection({ kitToSend, setKitToSend }: KitSelectionProps) {
  const [kitType, setKitType] = useState<KitType>("SIMPLE");
  const [tables, setTables] = useState<string>("");
  const [theme, setTheme] = useState<string>("");

  const [tablesToSelect, setTablesToSelect] = useState<ItemFormated[]>([]);
  const [themesToSelect, setThemesToSelect] = useState<Theme[]>([]);

  useEffect(() => {
    async function fetchElementsToSelect() {
      try {
        const res = await fetch(`${config.api_url}/kit?kitType=${kitType}`).then(res => res.json());
        console.log(res);

        if (!res.success) throw new Error(res.message);

        setThemesToSelect(res.data.themes);
        setTablesToSelect(res.data.tables);

      } catch (err) {
        console.error(err);
      }
    }

    fetchElementsToSelect();
  }, []);

  const handleSendKit = () => {
    setKitToSend({
      eventType: "KIT",
      kitType: kitType,
      tables: tables,
      theme: theme
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.fieldWrapper}>
        <label
          htmlFor="kitType"
          className={styles.label}
        >
          Selecione o tipo de KIT
        </label>

        <div className={styles.kitTypeContainer}>
          <div className={styles.kitSimple} onClick={() => setKitType("SIMPLE")}>
            <Image src={kitSimple} alt="kit-simple" className={styles.kitSimpleImage} />
          </div>

          <div className={styles.kitCylinder} onClick={() => setKitType("CYLINDER")}>
            <Image src={kitCylinder} alt="kit-cylinder" className={styles.kitCylinderImage} />
          </div>
        </div>
      </div>

      <div className={styles.fieldWrapper}>
        <label
          htmlFor="kitTables"
          className={styles.label}
        >
          Selecione as mesas que acompanharam o KIT
        </label>

        <div className={styles.tablesContainer}>
          {tablesToSelect.map((table, idx) => (
            <TableSelectionCard key={idx} table={table} />
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

        <div className={styles.themesContainer}>
          {themesToSelect.map((theme, idx) => (
            <ThemeSelectionCard key={idx} theme={theme} />
          ))}
        </div>
      </div>

      <div className={styles.buttons}>

      </div>
    </div>
  )
}