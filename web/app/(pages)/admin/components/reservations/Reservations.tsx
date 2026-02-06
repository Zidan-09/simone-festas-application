"use client";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import Loading from "@/app/components/Loading/Loading";
import ReservationCard from "./ReservationCard";
import styles from "./Reservations.module.css";

export default function Reservations() {
  const { reservations, loading } = useLoadReservations(false);

  if (loading) return (
    <Loading />
  )

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {reservations.map((reservation, idx) => (
          <ReservationCard
            key={idx}
          />
        ))}
      </div>
    </div>
  )
}