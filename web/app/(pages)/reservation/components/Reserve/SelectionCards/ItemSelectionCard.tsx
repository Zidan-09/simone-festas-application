import { type ItemFormated } from "@/app/types";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import styles from "./ItemSelectionCard.module.css";

interface ItemSelectionCardProps {
  item: ItemFormated;
  quantityToSend: number;
  handleAdd: (item: ItemFormated) => void;
  handleSub: (item: ItemFormated) => void;
}

export default function ItemSelectionCard({ item, quantityToSend, handleAdd, handleSub }: ItemSelectionCardProps) {
  const { image, variant, name, description, price, quantity } = item;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt="item"
          fill
          className={styles.img}
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      <div className={styles.info}>
        <span className={styles.variant}>{variant}</span>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>{formattedPrice}</p>
      </div>

      <div className={styles.buttons}>
        <button className={styles.subButton} onClick={() => handleSub(item)}>
          <Minus />
        </button>

        <p className={`${styles.quantity} ${quantityToSend > 0 ? styles.blue : ""}`}>{quantityToSend}</p>

        <button className={styles.addButton} onClick={() => {
          if (quantityToSend < quantity) handleAdd(item);
        }}>
          <Plus />
        </button>
      </div>
    </div>
  )
}