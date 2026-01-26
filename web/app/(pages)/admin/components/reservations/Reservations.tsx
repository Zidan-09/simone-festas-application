"use client";
import Loading from "@/app/components/Loading/Loading";
import { useLoadReservations } from "./hooks/useLoadReservations";
import styles from "./Reservations.module.css";
import ReservationCard from "./ReservationCard";

export default function Reservations() {
  const { reservations, loading } = useLoadReservations();

  if (loading) return (
    <Loading />
  )

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {reservations.map((idx, reservation) => (
          <ReservationCard
            
          />
        ))}
      </div>
    </div>
  )
}