import { ItemTypes } from "../item/itemTypes";

interface CreateItem {
  name: string,
  description: string,
  type: ItemTypes,
  price: number
}

interface GetItem {
  
}

interface DeleteItem {
  id: string;
}

export type { CreateItem, DeleteItem }