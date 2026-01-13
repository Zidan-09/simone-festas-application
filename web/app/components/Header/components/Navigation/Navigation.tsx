"use client";
import { Home, Cake, BoxIcon, Calendar, CrownIcon } from "lucide-react";
import styles from "./Navigation.module.css";

interface NavigationProps {
  actualPage: string | null;
  changePage: (page: string) => void;
}

export default function Navigation({ actualPage, changePage }: NavigationProps) {
  return (
    <div className={styles.container}>
      <div
      className={`${styles.option} ${actualPage === "home" ? styles.selected : ""}`}
      onClick={() => changePage("home")}
      >
        <Home size={40} />
        <span>Home</span>
      </div>

      <div
      className={`${styles.option} ${actualPage === "themes" ? styles.selected : ""}`}
      onClick={() => changePage("themes")}
      >
        <Cake size={40} />
        <span>Temas</span>
      </div>

      <div
      className={`${styles.option} ${actualPage === "catalog" ? styles.selected : ""}`}
      onClick={() => changePage("catalog")}
      >
        <BoxIcon size={40} />
        <span>Catálogo</span>
      </div>

      <div
      className={`${styles.option} ${actualPage === "reservation" ? styles.selected : ""}`}
      onClick={() => changePage("reservation")}
      >
        <Calendar size={40} />
        <span>Reservas</span>
      </div>

      <div
      className={`${styles.option} ${actualPage === "admin" ? styles.selected : ""}`}
      onClick={() => changePage("admin")}
      >
        <CrownIcon size={40} />
        <span>Admin</span>
      </div>
    </div>
  )
}