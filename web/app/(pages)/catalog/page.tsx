"use client";
import { useState } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import { useItems } from "@/app/hooks/items/useItems";
import SearchBar from "@/app/components/Search/SearchBar";
import ItemSection from "./components/ItemSection";
import ItemCard from "./components/ItemCard";
import config from "@/app/config-api.json";
import ItemModal from "./components/itemModal/ItemModal";
import Loading from "@/app/components/Loading/Loading";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const { panels, curtain, table, dessert_stand } = useItems();
  const { searching, results, search } = useSearch<any>(`${config.api_url}/item/search`);
  const [itemOpen, setItemOpen] = useState<boolean>(false);
  const [item, setItem] = useState<{ name: string, variant: string, description: string, price: number, image: string} | undefined>(undefined);

  const loading =
  panels.length === 0 &&
  curtain.length === 0 &&
  table.length === 0 &&
  dessert_stand.length === 0;

  const handleOpenModal = (name: string, variant: string, description: string, price: number, image: string) => {
    setItem({
      name,
      variant,
      description,
      price,
      image
    });
  };

  return (
    <main className={styles.container}>
      <SearchBar onSearch={search} />

      <div className={searching ? styles.searchContainer : styles.off}>
        {searching && (
          results.map((item, index) => (
            <ItemCard
              key={index}
              name={item.item.name}
              description={item.item.description}
              price={item.item.price}
              variant={item.variant}
              imageUrl={item.image}
              openModal={setItemOpen}
              modalFor={handleOpenModal}
            />
          ))
        )}
      </div>
      
      <div className={searching ? styles.off : styles.defaultContainer}>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <ItemSection
              title="Paineis"
              items={panels}
              openModal={setItemOpen}
              modalFor={handleOpenModal}
            />

            <ItemSection
              title="Cortinas"
              items={curtain}
              openModal={setItemOpen}
              modalFor={handleOpenModal}
            />

            <ItemSection
              title="Conjunto de Mesas"
              items={table}
              openModal={setItemOpen}
              modalFor={handleOpenModal}
            />

            <ItemSection
              title="Doceiras"
              items={dessert_stand}
              openModal={setItemOpen}
              modalFor={handleOpenModal}
            />
          </div>
        )}
      </div>
      
      {itemOpen && (
        <ItemModal
          name={item?.name}
          variant={item?.variant}
          description={item?.description}
          price={item?.price}
          image={item?.image}
        />
      )}
    </main>
  )
}