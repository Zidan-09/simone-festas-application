import Image from "next/image";
import type { ItemFormated } from "@/app/types";
import styles from "./TableSelectionCard.module.css";

interface TableSelectionCardProps {
  table: ItemFormated;
}

export default function TableSelectionCard({ table }: TableSelectionCardProps) {
  return (
    <div className={styles.table}>
      <div className={styles.tableImageWrapper}>
        <Image src={table.image} alt="table" className={styles.tableImage} fill sizes="(max-width: 768px) 100vw, 300px" />
      </div>

      <div className={styles.info}>
        <span className={styles.variant}>{table.variant}</span>
        <h3 className={styles.name}>{table.name}</h3>
      </div>
    </div>
  )
}