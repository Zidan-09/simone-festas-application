"use client";
import { useEffect, useState } from "react";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import LogginWarning from "./components/LogginWarning";
import ReservationCard from "../admin/components/reservations/ReservationCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";
import Reserve from "./components/Reserve";

export default function Reservation() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState(true);
  const [doAReserve, setDoAReserve] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch(`${config.api_url}/auth/check`).then(res => res.json());

      setLogged(res.success);
    };

    checkLogin();
  }, [logged]);

  if (!logged) return (
    <main className={styles.container}>
      <LogginWarning />
    </main>
  )

  return (
    <main className={styles.container}>
      <div className={styles.table}>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <button onClick={() => setDoAReserve(true)}>Faça sua reserva</button>
          </div>
        )}
      </div>

      {doAReserve && (
        <Reserve />
      )}
    </main>
  )
}