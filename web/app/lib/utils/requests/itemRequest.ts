import { Decimal } from "@prisma/client/runtime/client";
import { ItemTypes } from "../item/itemTypes";

interface CreateItem {
  main: {
    name: string;
    description: string;
    type: ItemTypes;
    price: number;
  };
  variants: {
    color: string;
    image: string;
    stockQuantity: number;
  }[];
}

interface EditItem {
  main: {
    id: string;
    name: string;
    description: string;
    type: ItemTypes;
    price: Decimal;
  };
  variants: {
    id?: string;
    color: string;
    image: string;
    stockQuantity: number;
  }[];
}

export type { CreateItem, EditItem }