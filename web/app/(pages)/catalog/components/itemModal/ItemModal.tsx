import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import styles from "./ItemModal.module.css";

interface ItemModalProps {
  name?: string;
  variant?: string;
  description?: string;
  price?: number;
  image?: string;
}

export default function ItemModal({ name, variant, description, price, image }: ItemModalProps) {
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button
          type="button"
          className={styles.btn}
        >
          <ArrowLeft size={40} />
        </button>
        voltar
      </div>

      <img
        src={image ? image : ""}
        alt="item-image"
        className={styles.itemImage}
      />

      <h2 className={styles.name}>{name}</h2>

      <h3 className={styles.variant}>{variant}</h3>

      <p className={styles.description}>{description}</p>

      <p className={styles.price}>{price}</p>
    </div>
  )
}