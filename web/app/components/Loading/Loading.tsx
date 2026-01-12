import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>Carregando...</span>
    </div>
  );
}