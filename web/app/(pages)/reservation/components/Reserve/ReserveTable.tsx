"use client";
import type { EventFormated } from "@/app/types";
import ReservationCard from "@/app/components/Reservation/ReservationCard";
import styles from "./ReserveTable.module.css";

interface ReserveTableProps {
  reserves: EventFormated[];
}

export default function ReserveTable({ reserves }: ReserveTableProps) {
  return (
    <div className={styles.container}>
      {reserves.map((reserve, idx) => (
        <ReservationCard
          key={idx}
          event={reserve}
        />
      ))}
    </div>
  )
}