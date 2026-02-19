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
      {reserves.length > 0 ? (
        reserves.map((reserve, idx) => (
          <ReservationCard
            key={idx}
            id={reserve.id}
            type={reserve.reserveType}
            eventDate={reserve.eventDate}
            address={reserve.address}
            status={reserve.status}
            bookingDate={reserve.createdAt}
            totalPrice={reserve.totalPrice}
            paidPrice={reserve.totalPaid}
            services={reserve.services}
            details={reserve.reserve}
          />
        ))
      ) : (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>Você não fez nenhuma reserva ainda...</p>
        </div>
      )}
    </div>
  )
}