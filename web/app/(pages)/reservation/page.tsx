"use client";
import { useEffect, useState } from "react";
import { useLoadReservations } from "@/app/hooks/events/useLoadReservations";
import type { EventItem, ReserveType, EventKit, EventTable } from "@/app/types";
import ReserveTable from "./components/ReserveTable";
import LogginWarning from "./components/LogginWarning";
import Loading from "@/app/components/Loading/Loading";
import ReserveInit from "./components/ReserveInit";
import ItemSelection from "./components/Selection/ItemSelection";
import KitSelection from "./components/Selection/KitSelection";
import TableSelection from "./components/Selection/TableSelection";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";

export default function ReservationsPage() {
  const { reservations, loading } = useLoadReservations(true);
  const [logged, setLogged] = useState<boolean | null>(null);
  const [reserveStep, setReserveStep] = useState<number>(0);

  const [eventDate, setEventDate] = useState<string>("");
  const [eventType, setEventType] = useState<ReserveType>("KIT");

  const [items, setItems] = useState<EventItem>({
    eventType: "ITEMS",
    items: []
  });

  const [kit, setKit] = useState<EventKit>({
    eventType: "KIT",
    kitType: "SIMPLE",
    tables: "",
    theme: ""
  });

  const [table, setTable] = useState<EventTable>({
    eventType: "TABLE",
    colorToneId: "",
    numberOfPeople: 0
  });

  const reset = () => {
    setReserveStep(0);
    setEventDate("");
    setEventType("ITEMS");
    setItems({
      eventType: "ITEMS",
      items: []
    });
    setKit({
      eventType: "KIT",
      kitType: "SIMPLE",
      tables: "",
      theme: ""
    });
    setTable({
      eventType: "TABLE",
      colorToneId: "",
      numberOfPeople: 0
    });
  }

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
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Minhas Reservas</h2>
        <p className={styles.subtitle}>Revise datas, itens e deixe tudo pronto para o grande dia.</p>
      </div>

      <ReserveTable
        reserves={reservations}
      />

      <button className={styles.reserveButton} onClick={() => setReserveStep(1)}>
        Quero Reservar!
      </button>

      {reserveStep === 1 ? (
        <ReserveInit
          changeStep={setReserveStep} 
          eventDate={eventDate} 
          setEventDate={setEventDate} 
          eventType={eventType} 
          setEventType={setEventType}
          reset={reset}
        />) : ""}

      {reserveStep === 2 && eventType === "ITEMS" ? (
        <ItemSelection itemsToSend={items} setItemsToSend={setItems} changeStep={setReserveStep} />
      ) : ""}

      {reserveStep === 2 && eventType === "KIT" ? (
        <KitSelection kitToSend={kit} setKitToSend={setKit} changeStep={setReserveStep} />
      ) : ""}

      {reserveStep === 2 && eventType === "TABLE" ? (
        <TableSelection tablesToSend={table} setTablesToSend={setTable} changeStep={setReserveStep} />
      ) : ""}
    </main>
  );
}
