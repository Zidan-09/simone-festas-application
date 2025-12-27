import Image from "next/image";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  name: string;
  description: string;
  price: number;
  variant: string;
  imageUrl: string;
}

export default function ItemCard({ name, description, price, variant, imageUrl }: ItemCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={name}
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