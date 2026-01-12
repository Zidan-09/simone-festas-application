"use client";
import { useSearch } from "@/app/hooks/search/useSearch";
import { useItems } from "@/app/hooks/items/useItems";
import SearchBar from "@/app/components/Search/SearchBar";
import ItemCard from "./components/ItemCard";
import config from "@/app/config-api.json";
import Loading from "@/app/components/Loading/Loading";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const { panels, curtain, table, dessert_stand } = useItems();
  const { searching, results, search } = useSearch<any>(`${config.api_url}/item/search`);
  const loading =
  panels.length === 0 &&
  curtain.length === 0 &&
  table.length === 0 &&
  dessert_stand.length === 0;

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
            />
          ))
        )}
      </div>
      
      <div className={searching ? styles.off : styles.defaultContainer}>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Paineis</h2>
              <div className={styles.itemContainer}>
                {panels.map((item, index) => (
                  <ItemCard
                    key={index}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    variant={item.variant}
                    imageUrl={item.image}
                  />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cortinas</h2>
              <div className={styles.itemContainer}>
                {curtain.map((item, index) => (
                  <ItemCard
                    key={index}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    variant={item.variant}
                    imageUrl={item.image}
                  />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Conjunto de Mesas</h2>
              <div className={styles.itemContainer}>
                {table.map((item, index) => (
                  <ItemCard
                    key={index}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    variant={item.variant}
                    imageUrl={item.image}
                  />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Doceiras</h2>
              <div className={styles.itemContainer}>
                {dessert_stand.map((item, index) => (
                  <ItemCard
                    key={index}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    variant={item.variant}
                    imageUrl={item.image}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}