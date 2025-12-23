import { Decimal } from "@prisma/client/runtime/client";
import { ItemType } from "@/app/generated/prisma/enums";

interface CreateItem {
  main: {
    name: string;
    description: string;
    type: ItemType;
    price: number;
  };
  variants: {
    color: string;
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
    color: string;
    image: string;
    stockQuantity: number;
  }[];
}

export type { CreateItem, EditItem }