import { ThemeCategory } from "@prisma/client";

interface CreateTheme {
  theme: {
    name: string;
    mainImage: string;
    category: ThemeCategory;
  };
  images: {
    url: string;
  }[];
  items: {
    item_id: string;
    quantity: number;
  }[];
}

interface EditTheme {
  theme: {
    id: string;
    name: string;
    mainImage: string;
  };
  images: {
    id?: string;
    url: string;
  }[];
  items: {
    itemId: string;
    quantity: number;
  }[];
}

export type { CreateTheme, EditTheme }