"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Reservation, useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";
import LogginWarning from "./components/LogginWarning";
import ReservationCard from "@/app/components/Reservation/ReservationCard";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";

export default function ReservationsPage() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState<boolean | null>(null);

  const item = {
    id: "123",
    itemId: "111",
    variant: "Cuscuz",
    image: "",
    quantity: 1,
    keyWords: ["asdadsada"],
  };

  const theme = {
    id: "peixe",
    name: "cuscuz",
    mainImage: "string",
    category: ThemeCategory.KIDS,
    images: []
  };

  const kit = {
    kitType: "",
    tables: item,
    theme: theme,
    items: [],
  };

  const address = {
    cep: "64208-335",
    city: "Parnaíba",
    number: "1209",
    street: "Avenida Deputado Pinheiro Machado",
    complement: "",
    neighborhood: "Piauí",
  }

  const reservationsDock: Reservation[] = [
    { id: "1", ownerId: "121212", eventDate: new Date().toISOString(), createdAt: new Date().toISOString(), address: address, totalPrice: 20, totalPaid: 10, reserveType: "KIT", services: [], reserve: kit, status: "CONFIRMED"}
  ];

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
        {reservationsDock ?
        reservationsDock.length === 0 ? (
          <p>Nenhuma reserva</p>
        ) : (
          reservationsDock.map((reserve, idx) => (
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
