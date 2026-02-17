import Image from "next/image";
import type { Service } from "@/app/types";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: Service;
  selecteds: string[];
}

export default function ServiceCard({ service, selecteds }: ServiceCardProps) {
  const areSelected = selecteds.includes(service.id);

  return (
    <div className={`${styles.card} ${areSelected ? styles.selected : ""}`}>
      <div className={styles.iconWrapper}>
        <Image src={""} alt="icon" className={styles.icon} fill />
      </div>

      <h2 className={styles.name}>{service.name}</h2>
      <p className={styles.price}>{service.price}</p>
    </div>
  );
}