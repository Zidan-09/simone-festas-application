"use client";
import { Dispatch, SetStateAction } from "react";
import { Cake, BoxIcon, TagIcon } from "lucide-react";
import type { Section } from "../Table";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  actualSection: string;
  setActualSection: Dispatch<SetStateAction<Section>>;
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