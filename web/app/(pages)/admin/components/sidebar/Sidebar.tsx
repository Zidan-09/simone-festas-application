"use client";
import { Dispatch, SetStateAction } from "react";
import { Cake, BoxIcon, TagIcon, Calendar } from "lucide-react";
import type { Section } from "../Table";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  actualSection: string;
  setActualSection: Dispatch<SetStateAction<Section>>;
  reservationOpen: boolean;
  setReservationOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ actualSection, setActualSection, reservationOpen, setReservationOpen }: SidebarProps) {
  return (
    <div className={styles.container}>
      <div
      className={`${styles.option} ${actualSection === "item" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "itens") setActualSection("item");
        setReservationOpen(false);
      }}
      >
        <BoxIcon size={40} />
        <span>Itens</span>
      </div>

      <div
      className={`${styles.option} ${actualSection === "theme" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "themes") setActualSection("theme");
        setReservationOpen(false);
      }}
      >
        <Cake size={40} />
        <span>Temas</span>
      </div>

      <div
      className={`${styles.option} ${actualSection === "service" ? styles.selected : ""}`}
      onClick={() => {
        if (actualSection !== "services") setActualSection("service");
        setReservationOpen(false);
      }}
      >
        <TagIcon size={40} />
        <span>Serviços</span>
      </div>

      <hr className={styles.divisor} />

      <div
      className={`${styles.option} ${reservationOpen ? styles.selected : ""}`}
      onClick={() => setReservationOpen(!reservationOpen)}
      >
        <Calendar size={40} />
        <span>Reservas</span>
      </div>
    </div>
  );
};