"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Item } from "@/app/hooks/items/useItems";
import ItemSection from "../../catalog/components/ItemSection";
import Loading from "@/app/components/Loading/Loading";
import config from "@/app/config-api.json";
import styles from "./ItemModal.module.css";


export default function ItemModal() {
  const [item, setItem] = useState<Item>();
  const [others, setOthers] = useState<Item[]>();
  const [loading, setLoading] = useState<boolean>(false);


  const formattedPrice = item ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(item.price) : "";

  const params = useParams();

  useEffect(() => {
    async function getItem() {
      setLoading(true);

      try {
        const res = await fetch(
          `${config.api_url}/item/variant/${params.id}`
        ).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setItem(res.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getItem();
  }, [params.id]);

  useEffect(() => {
    async function getOthers() {
      if (!item) return;

      setLoading(true);

      try {
        const res = await fetch(
          `${config.api_url}/item/type/${item.type}`
        ).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setOthers(res.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getOthers();
  }, [item]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <Loading />
    </div>
  );
  
  return (
    <main className={styles.container}>
      {item && others && (
        <>
          <div className={styles.itemCard}>
            <div className={styles.itemGrid}>
              <div className={styles.grid1}>
                <Image
                  src={item.image}
                  alt="item-image"
                  width={1980}
                  height={1980}
                  className={styles.itemImage}
                />
              </div>

              <div className={styles.grid2}>
                <div className={styles.nameContainer}>
                  <h2 className={styles.name}>{item.name}</h2>
        
                  <h3 className={styles.variant}>{item.variant}</h3>
                </div>

                <Image
                  src={item.image}
                  alt="item-image"
                  width={720}
                  height={720}
                  className={styles.itemImage}
                />
          
                <p className={styles.description}>{item.description}</p>
          
                <p className={styles.price}>{formattedPrice}</p>
              </div>
            </div>

            <hr className={styles.divisor} />

            <ItemSection
              title="Outros itens do mesmo tipo:"
              items={others.filter(i => i.vid !== params.id)}
            />
          </div>
        </>
      )}
    </main>
  );
}