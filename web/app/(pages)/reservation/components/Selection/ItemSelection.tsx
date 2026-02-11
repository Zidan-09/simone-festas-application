"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSearch } from "@/app/hooks/search/useSearch";
import { type ItemSearch, type EventItem, type ItemFormated } from "@/app/types";
import SearchBar from "@/app/components/Search/SearchBar";
import config from "@/app/config-api.json";
import styles from "./ItemSelection.module.css";
import ItemSelectionCard from "../SelectionCards/ItemSelectionCard";
import Loading from "@/app/components/Loading/Loading";

function normalizeItem(item: ItemFormated | ItemSearch): ItemFormated {
  if ("item" in item) {
    return {
      id: item.itemId,
      name: item.item.name,
      description: item.item.description,
      type: item.item.type,
      price: item.item.price,
      vid: item.id,
      variant: item.variant,
      image: item.image,
      quantity: item.quantity,
      keywords: item.keyWords,
    };
  }

  return item;
}

interface ItemSelectionProps {
  itemsToSend: EventItem;
  setItemsToSend: Dispatch<SetStateAction<EventItem>>;
}

export default function ItemSelection({ itemsToSend, setItemsToSend }: ItemSelectionProps) {
  const { searching, results, search } = useSearch<ItemSearch>(`${config.api_url}/item/search`);
  const [items, setItems] = useState<ItemFormated[]>([]);
  const itemsOfSearch = results.map(normalizeItem);

  const handleAddItemQuantity = (itemId: string) => {
    const item = itemsToSend.items.find(i => i.id === itemId);

    if (!item) {
      const addItem = {
        id: itemId,
        quantity: 1
      };

      setItemsToSend((prev) => ({
        ...prev,
        items: [...prev.items, addItem]
      }));

      return;
    }

    item.quantity++;

    setItemsToSend((prev) => ({
      ...prev,
      items: [...prev.items.filter(i => i.id !== itemId), item]
    }));
  }

  const handleSubItemQuantity = (itemId: string) => {
    const item = itemsToSend.items.find(i => i.id === itemId);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      setItemsToSend((prev) => ({
        ...prev,
        items: [...prev.items.filter(i => i.id !== itemId)]
      }));

      return;
    }

    setItemsToSend((prev) => ({
      ...prev,
      items: [...prev.items.filter(i => i.id !== itemId), item]
    }));
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
      <div className={styles.searchContainer}>
        <SearchBar onSearch={search} />
      </div>

      <div className={styles.items}>
        {(searching ? itemsOfSearch : items).length > 0 ? (
          (searching ? itemsOfSearch : items).map((item, idx) => (
            <ItemSelectionCard
              key={idx}
              item={item}
              handleAdd={handleAddItemQuantity}
              handleSub={handleSubItemQuantity}
              quantityToSend={itemsToSend.items.find(i => i.id === item.vid)?.quantity || 0}
              quantity={item.quantity}
            />
          ))
        ) : (
          <div className={styles.loadingContainer}>
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}