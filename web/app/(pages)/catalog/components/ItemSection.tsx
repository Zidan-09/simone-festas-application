import { Item } from "@/app/hooks/items/useItems";
import ItemCard from "./ItemCard";
import styles from "./ItemSection.module.css";

interface ItemSectionProps {
  title: string;
  items: Item[];
};

export default function ItemSection({ title, items }: ItemSectionProps) {
  if (!items || items.length === 0) return;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.itemContainer}>
        {items.map((item, index) => (
          <ItemCard
            key={index}
            id={item.vid}
            name={item.name}
            description={item.description}
            price={item.price}
            variant={item.variant}
            imageUrl={item.image}
          />
        ))}
      </div>
    </section>
  );
}