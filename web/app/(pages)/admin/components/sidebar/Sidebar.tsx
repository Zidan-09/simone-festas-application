"use client";
import { Cake, BoxIcon, TagIcon } from "lucide-react";
import styles from "./Sidebar.module.css";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  actualSection: string;
  setActualSection: Dispatch<SetStateAction<string>>;
}

export default function Sidebar({ actualSection, setActualSection }: SidebarProps) {
  return (
    <div className={styles.container}>
      <div
      className={`${styles.option} ${actualSection === "item" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "itens") setActualSection("item");
      }}
      >
        <BoxIcon size={40} />
        <span>Itens</span>
      </div>

      <div
      className={`${styles.option} ${actualSection === "theme" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "themes") setActualSection("theme");
      }}
      >
        <Cake size={40} />
        <span>Temas</span>
      </div>

      <div
      className={`${styles.option} ${actualSection === "service" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "services") setActualSection("service");
      }}
      >
        <TagIcon size={40} />
        <span>Serviços</span>
      </div>
    </div>
  )
}