import { useRouter } from "next/navigation";
import styles from "./LogginWarning.module.css";

export default function LogginWarning() {
  const router = useRouter();

  return (
    <div className={styles.warning}>
      <h2 className={styles.warningTitle}>Ops... Parece que você não está logado :c</h2>
      <p className={styles.warningText}>Sem estar logado você não pode realizar reservas em nosso site</p>
      <p className={styles.warningSolution}>Se quer fazer uma reserva converse conosco no whatsapp ou loja física ou então clique <a onClick={() => router.push("/auth")}>aqui</a> para fazer login :D</p>
    </div>
  );
}