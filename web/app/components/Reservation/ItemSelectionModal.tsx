"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { ItemFormated, ItemSearch } from "@/app/types";
import { useSearch } from "@/app/hooks/search/useSearch";

import Loading from "../Loading/Loading";
import ItemSelectionCard from "@/app/(pages)/reservation/components/Reserve/SelectionCards/ItemSelectionCard";
import SearchBar from "../Search/SearchBar";

import config from "@/app/config-api.json";
import styles from "./ItemSelectionModal.module.css";
import { normalizeItem } from "@/app/utils";

interface ItemSelectionModalProps {
  selectedItems: ItemFormated[];
  setSelectedItems: Dispatch<SetStateAction<ItemFormated[]>>;
  handleAddKitItems: () => void;
}

export default function ItemSelectionModal({ selectedItems, setSelectedItems, handleAddKitItems }: ItemSelectionModalProps) {
  const { searching, results, search } = useSearch<ItemSearch>(`${config.api_url}/item/search`);
  const itemsFromSearch = results.map(normalizeItem);
  const [items, setItems] = useState<ItemFormated[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const itemsMap = new Map(
    selectedItems.map(item => [item.id, item.quantity])
  );

  const handleAddItemQuantity = (itemClicked: ItemFormated) => {
    const item = selectedItems.find(i => i.id === itemClicked.vid);

    if (!item) {
      const addItem: ItemFormated = {
        id: itemClicked.vid,
        name: itemClicked.name,
        description: itemClicked.description,
        type: itemClicked.type,
        vid: itemClicked.vid,
        variant: itemClicked.variant,
        image: itemClicked.image,
        price: itemClicked.price,
        quantity: 1,
        keywords: itemClicked.keywords
      };

      return setSelectedItems((prev) => [...prev, addItem]);
    }

    item.quantity++;

    setSelectedItems((prev) => [...prev.filter(i => i.id !== itemClicked.vid), item]);
  }

  const handleSubItemQuantity = (itemClicked: ItemFormated) => {
    const item = selectedItems.find(i => i.id === itemClicked.vid);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      return setSelectedItems((prev) => [...prev.filter(i => i.id !== itemClicked.vid)]);
    }

    setSelectedItems((prev) => [...prev.filter(i => i.id !== itemClicked.vid), item]);
  }

  useEffect(() => {
    setLoading(true);

    async function getItems() {
      try {
        const res = await fetch(`${config.api_url}/item`).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setItems(res.data);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    getItems();
  }, []);

  return (
    <div className={styles.container}>
      <SearchBar
        onSearch={search}
      />

      {loading || (searching && itemsFromSearch.length <= 0) ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableItems}>
          {(searching ? itemsFromSearch : items).map((i, idx) => (
            <ItemSelectionCard
              key={idx}
              item={i}
              quantityToSend={itemsMap.get(i.vid) ?? 0}
              handleAdd={handleAddItemQuantity}
              handleSub={handleSubItemQuantity}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        className={styles.button}
        onClick={handleAddKitItems}
      >
        Pronto
      </button>
    </div>
  )
}