import Image from "next/image";
import { Item } from "@/app/hooks/items/useItems";
import { ArrowLeft } from "lucide-react";
import styles from "./ItemModal.module.css";

interface ItemModalProps {
  item: Item
}

export default function ItemModal({ item }: ItemModalProps) {
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

      <Image
        src={item.image}
        alt="item-image"
        className={styles.itemImage}
      />

      <h2 className={styles.name}>{item.name}</h2>

      <h3 className={styles.variant}>{item.variant}</h3>

      <p className={styles.description}>{item.description}</p>

      <p className={styles.price}>{item.price}</p>
    </div>
  )
}