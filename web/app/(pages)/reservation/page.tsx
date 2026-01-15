"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/app/config-api.json";
import styles from "./Reservation.module.css";

export default function Reservation() {
  const [logged, setLogged] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch(`${config.api_url}/auth/check`).then(res => res.json());

      setLogged(res.success);
    };

    checkLogin();
  }, [logged]);

  return (
    <main className={styles.container}>
      {logged ? (
        <div>
      
        </div>
      ) : (
        <div className={styles.warning}>
          <h2 className={styles.warningTitle}>Ops... Parece que você não está logado :c</h2>
          <p className={styles.warningText}>Sem estar logado você não pode realizar reservas em nosso site</p>
          <p className={styles.warningSolution}>Se quer fazer uma reserva converse conosco no whatsapp ou loja física ou então clique <a onClick={() => router.push("/auth")}>aqui</a> para fazer login :D</p>
        </div>
      )}
    </main>
  )
}