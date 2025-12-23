"use client";
import { useState } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import SearchBar from "@/app/components/Search/SearchBar";
import ItemCard from "./components/ItemCard";
import config from "@/app/config.json";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const { searching, results, search } = useSearch<any>(`${config.api_dev_url}/item/search`);

  const handleCloseFilter = () => {
    if (filterOpen) setFilterOpen(!filterOpen);
  }

  return (
    <div className={styles.container} onClick={handleCloseFilter}>
      <SearchBar onSearch={search} />

      {searching ? (
        console.log(results),
        results.map((item, index) => (
          <ItemCard
            key={index}
            name={item.name}
            description={item.description}
            price={item.price}
            color={item.color}
            imageUrl={item.image}
          />
        ))
      ) : (
        <div className={styles.searchWrapper}>
          <p className={styles.searchWarning}>Nenhum item encontrado :(</p>
        </div>
      )}
    </div>
  )
}