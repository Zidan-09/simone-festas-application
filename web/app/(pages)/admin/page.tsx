"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckUser } from "@/app/hooks/check/useCheckUser";
import type { Section } from "./components/Table";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./components/Table";
import Reservations from "./components/reservations/Reservations";
import styles from "./Admin.module.css";

export default function Admin() {
  const { isAdmin, checking } = useCheckUser();
  const [actualSection, setActualSection] = useState<Section>("item");
  const [reservationOpen, setReservationOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && !checking) {
      router.push("/home");
    }
  }, [checking]);

  if (!isAdmin) {
    return <main className={styles.container} />;
  }

  return (
    <main className={styles.container}>
      <Sidebar
      actualSection={actualSection}
      setActualSection={setActualSection}
      reservationOpen={reservationOpen}
      setReservationOpen={setReservationOpen}
      />

      {reservationOpen ? (
        <Reservations />
      ) : (
        <Table actualSection={actualSection} />
      )}
    </main>
  ) 
}