"use client";
import { useEffect, useState } from "react";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import LogginWarning from "./components/LogginWarning";
import ReservationCard from "../admin/components/reservations/ReservationCard";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";

export default function Reservation() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState(true);

  const handleMadeReserve = async () => {
    const result = await fetch(`http://localhost:3000/api/v1/event`, {
      method: "POST",
      body: JSON.stringify({
        event: {
          date: new Date("2026-04-19").toISOString(),
          address: {
            cep: "64208-335",
            city: "Parnaíba",
            number: "1209",
            street: "Avenida Deputado Pinheiro Machado",
            complement: "",
            neighborhood: "Piauí"
          },
          total: 10,
          paid: 5
        },
        services: [
          "aa03e32d-2452-44ff-9897-a632c75f3cc7"
        ],
        items: [
          { id: "d4008278-8fb0-41d6-8bad-28ffa94d4f0d", quantity: 1 }
        ]
      })
    }).then(res => res.json());

    console.log(result);
  }

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
            <button onClick={handleMadeReserve}>Faça sua reserva</button>
          </div>
        )}
      </div>
    </main>
  )
}