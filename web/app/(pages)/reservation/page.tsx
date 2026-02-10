"use client";
import { useEffect, useState } from "react";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import LogginWarning from "./components/LogginWarning";
import ReservationCard from "@/app/components/Reservation/ReservationCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";

export default function ReservationsPage() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch(`${config.api_url}/auth/check`).then(res => res.json());
      setLogged(res.success);
    }
    checkLogin();
  }, []);

  if (logged === null || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (!logged) {
    return (
      <main className={styles.container}>
        <LogginWarning />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h2>Minhas Reservas</h2>

      <div>
        {reservations ?
        reservations.length === 0 ? (
          <p>Nenhuma reserva</p>
        ) : (
          reservations.map((reserve, idx) => (
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
        ) : ""}
      </div>
    </main>
  );
}
