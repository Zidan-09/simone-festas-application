"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Section } from "./components/Table";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./components/Table";
import config from "@/app/config-api.json";
import styles from "./Admin.module.css";
import Reservations from "./components/reservations/Reservations";

export default function Admin() {
  const [actualSection, setActualSection] = useState<Section>("item");
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [reservationOpen, setReservationOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const admin = await fetch(`${config.api_url}/auth/check/admin`).then(res => res.json());

      setIsAdmin(admin.success);
    };

    checkAdmin();
  }, [isAdmin]);

  if (!isAdmin) return router.push("/home");

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