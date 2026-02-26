"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import { type ItemSearch, type EventItem, type ItemFormated } from "@/app/types";
import { formatPrice, normalizeItem } from "@/app/utils";

import SearchBar from "@/app/components/Search/SearchBar";
import ItemSelectionCard from "../SelectionCards/ItemSelectionCard";
import Loading from "@/app/components/Loading/Loading";
import Buttons from "@/app/components/Reservation/Buttons/Buttons";

import config from "@/app/config-api.json";
import styles from "./ItemSelection.module.css";

interface ItemSelectionProps {
  itemsToSend: EventItem;
  setItemsToSend: Dispatch<SetStateAction<EventItem>>;
  changeStep: Dispatch<SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: Dispatch<SetStateAction<number>>;
}

export default function ItemSelection({ itemsToSend, setItemsToSend, changeStep, totalPrice, setTotalPrice }: ItemSelectionProps) {
  const { searching, results, search } = useSearch<ItemSearch>(`${config.api_url}/item/search`);
  const [items, setItems] = useState<ItemFormated[]>([]);
  const itemsOfSearch = results.map(normalizeItem);

  const handleAddItemQuantity = (itemClicked: ItemFormated) => {
    const item = itemsToSend.items.find(i => i.id === itemClicked.vid);

    if (!item) {
      const addItem = {
        id: itemClicked.vid,
        name: itemClicked.name,
        variant: itemClicked.variant,
        price: itemClicked.price,
        quantity: 1
      };

      setItemsToSend((prev) => ({
        ...prev,
        items: [...prev.items, addItem]
      }));

      setTotalPrice(prev => prev + itemClicked.price);

      return;
    }

    item.quantity++;

    setItemsToSend((prev) => ({
      ...prev,
      items: [...prev.items.filter(i => i.id !== itemClicked.vid), item]
    }));

    setTotalPrice(prev => prev + itemClicked.price);
  }

  const handleSubItemQuantity = (itemClicked: ItemFormated) => {
    const item = itemsToSend.items.find(i => i.id === itemClicked.vid);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      setItemsToSend((prev) => ({
        ...prev,
        items: [...prev.items.filter(i => i.id !== itemClicked.vid)]
      }));

      setTotalPrice(prev => prev - itemClicked.price);

      return;
    }

    setItemsToSend((prev) => ({
      ...prev,
      items: [...prev.items.filter(i => i.id !== itemClicked.vid), item]
    }));

    setTotalPrice(prev => prev - itemClicked.price);
  }

  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(`${config.api_url}/item`).then(res => res.json());
  
        if (!res.success) throw new Error(res.message);
  
        setItems(res.data);

      } catch (err) {
        console.error(err);
      }
    }

    getItems();

  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.stepTitle}>Agora Vamos Montar Seu Evento</h2>
        <p className={styles.stepSubtitle}>Personalize sua reserva do jeito que você imaginou</p>
      </div>

      <div className={styles.searchContainer}>
        <SearchBar onSearch={search} />
      </div>

      <div className={styles.items}>
        {(searching ? itemsOfSearch : items).length > 0 ? (
          (searching ? itemsOfSearch : items).slice(0, 4).map((item, idx) => (
            <ItemSelectionCard
              key={idx}
              item={item}
              handleAdd={handleAddItemQuantity}
              handleSub={handleSubItemQuantity}
              quantityToSend={itemsToSend.items.find(i => i.id === item.vid)?.quantity || 0}
            />
          ))
        ) : (
          <div className={styles.loadingContainer}>
            <Loading />
          </div>
        )}
      </div>

      <div className={styles.total}>
        <p className={styles.totalPrice}>Valor total: {formatPrice(totalPrice)}</p>
      </div>

      <Buttons
        firstText="Voltar"
        firstAction={() => {
          changeStep(1);
        }}
        secondText="Próximo"
        secondAction={() => changeStep(3)}
        secondDisabled={itemsToSend.items.length <= 0}
      />
    </div>
  )
}