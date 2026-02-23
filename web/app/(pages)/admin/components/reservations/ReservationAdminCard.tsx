import type { EventFormated } from "@/app/types";
import styles from "./ReservationAdminCard.module.css";

interface ReservationAdminCardProps {
  reservation: EventFormated;
}

export default function ReservationAdminCard({ reservation }: ReservationAdminCardProps) {
  return (
    <div className={styles.card}>

    </div>
  );
}