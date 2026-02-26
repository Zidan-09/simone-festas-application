import type { ItemFormated, ItemSearch } from "./types";

export function formatPrice(value: number | null): string {
  if (value === null) return "";

  return new Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function normalizeItem(item: ItemFormated | ItemSearch): ItemFormated {
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