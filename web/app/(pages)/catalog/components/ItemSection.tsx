import { Dispatch, SetStateAction } from "react";
import { Item } from "@/app/hooks/items/useItems";
import ItemCard from "./ItemCard";
import styles from "./ItemSection.module.css";

interface ItemSectionProps {
  title: string;
  items: Item[];
  openModal: Dispatch<SetStateAction<boolean>>;
  modalFor: (name: string, variant: string, description: string, price: number, image: string) => void;
};

export default function ItemSection({ title, items, openModal, modalFor }: ItemSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.itemContainer}>
        {items.map((item, index) => (
          <ItemCard
            key={index}
            name={item.name}
            description={item.description}
            price={item.price}
            variant={item.variant}
            imageUrl={item.image}
            openModal={openModal}
            modalFor={modalFor}
          />
        ))}
      </div>
    </section>
  );
}