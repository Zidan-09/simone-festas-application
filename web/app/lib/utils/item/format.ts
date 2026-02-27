import { Prisma, ItemType } from "@prisma/client";
import { onlyFinalKeywords } from "../server/onlyFinalKeywords";

export type ItemFormated = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  price: number;
  vid: string;
  variant: string;
  image: string;
  quantity: number;
  keywords: string[];
}

type ItemWithVariants = Prisma.ItemGetPayload<{
  include: { variants: true }
}>;

export function format(queryResult: ItemWithVariants[]): ItemFormated[] {
  const result: ItemFormated[] = [];

  if (queryResult.length === 0) return [];

  queryResult.forEach(item => {
    const base = {
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      type: item.type,
      price: Number(item.price),
    };

    item.variants.forEach(variant => {
      result.push({
        ...base,
        vid: variant.id,
        variant: variant.variant ?? "",
        image: variant.image ?? "",
        quantity: variant.quantity,
        keywords: onlyFinalKeywords(variant.keyWords)
      });
    });
  });
  return result;
}
