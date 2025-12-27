import { Decimal } from "@prisma/client/runtime/client";
import { ItemType } from "@prisma/client";

interface CreateItem {
  main: {
    name: string;
    description: string;
    type: ItemType;
    price: number;
  };
  variants: {
    variant: string;
    image: File;
    stockQuantity: number;
  }[];
}

interface EditItem {
  main: {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    price: Decimal;
  };
  variants: {
    id?: string;
    variant: string;
    image: string;
    stockQuantity: number;
  }[];
}

export type { CreateItem, EditItem }