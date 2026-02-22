"use client";
import { useEffect } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import { useItems } from "@/app/hooks/items/useItems";
import SearchBar from "@/app/components/Search/SearchBar";
import ItemSection from "./components/ItemSection";
import ItemCard from "./components/ItemCard";
import type { ItemSearch } from "@/app/types";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./Catalog.module.css";

export default function Catalog({ query }: { query?: string }) {
  const { panels, curtain, table, dessert_stand, loading } = useItems();
  const { searching, results, search } = useSearch<ItemSearch>(`${config.api_url}/item/search`);

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query]);

  return (
    <div className={styles.container}>
      <SearchBar onSearch={search} />

      <div className={searching ? styles.searchContainer : styles.off}>
        {searching && (
          results.map((item, index) => (
            <ItemCard
              key={index}
              id={item.id}
              name={item.item.name}
              description={item.item.description}
              price={item.item.price}
              variant={item.variant}
              imageUrl={item.image}
            />
          ))
        )}
      </div>
      
      <div className={searching ? styles.off : styles.defaultContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loading />
          </div>
        ) : (
          <div>
            <ItemSection
              title="Paineis"
              items={panels}
            />

            <ItemSection
              title="Cortinas"
              items={curtain} 
            />

            <ItemSection
              title="Conjunto de Mesas"
              items={table}
            />

            <ItemSection
              title="Doceiras"
              items={dessert_stand}
            />
          </div>
        )}
      </div>
    </div>
  )
}