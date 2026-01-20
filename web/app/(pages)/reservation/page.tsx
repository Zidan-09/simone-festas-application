"use client";
import { useEffect, useState } from "react";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";
import LogginWarning from "./components/LogginWarning";

export default function Reservation() {
  const [logged, setLogged] = useState(true);

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
      
    </main>
  )
}