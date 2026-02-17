import Image from "next/image";
import type { Service } from "@/app/types";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: Service;
  selecteds: string[];
}

export default function ServiceCard({ service, selecteds }: ServiceCardProps) {
  const areSelected = selecteds.includes(service.id);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(service.price);

  return (
    <div className={`${styles.card} ${areSelected ? styles.selected : ""}`}>
      <div className={styles.iconWrapper}>
        <Image src={service.icon} alt="icon" className={styles.icon} fill sizes="(max-width: 768px) 100vw, 300px" />
      </div>

      <h2 className={styles.name}>{service.name}</h2>
      <p className={styles.price}>{formattedPrice}</p>
    </div>
  );
}