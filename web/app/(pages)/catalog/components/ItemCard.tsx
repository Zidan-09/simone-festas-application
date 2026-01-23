import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  name: string;
  description: string;
  price: number;
  variant: string;
  imageUrl: string;
  openModal: Dispatch<SetStateAction<boolean>>;
  modalFor: (name: string, variant: string, description: string, price: number, image: string) => void;
}

export default function ItemCard({ name, description, price, variant, imageUrl, openModal, modalFor }: ItemCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  return (
    <div
      className={styles.card}
      onClick={() => {
        openModal(true);
        modalFor(name, variant, description, price, imageUrl);
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
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
    </div>
  );
}