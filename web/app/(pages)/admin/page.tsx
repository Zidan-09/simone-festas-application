"use client";
import styles from "./Admin.module.css";
import CreateItem from "./components/CreateItem";

export default function Admin() {
  return (
    <main className={styles.container}>
      <section className={styles.description}>
        <h2 className={styles.descriptionTitle}>Bem vindo a área de ADMINISTRADOR!</h2>
      </section>

      <section className={styles.items}>
        <CreateItem />
      </section>

      <section className={styles.themes}>
        
      </section>

      <section className={styles.events}>

      </section>
    </main>
  ) 
}