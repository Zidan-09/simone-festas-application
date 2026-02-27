import { ItemInput } from "../../dto/event.request"

type NormalizedItems = {
  id: string;
  quantity: number;
}

export function normalizeItems(items: ItemInput): NormalizedItems {
  return {
    id: items.id,
    quantity: items.quantity ?? 1
  }
}