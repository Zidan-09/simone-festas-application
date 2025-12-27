import { Prisma, ItemType } from "@prisma/client";

type Formated = {
  name: string;
  description: string;
  type: ItemType;
  price: number;
  variant: string;
  image: string;
  quantity: number;
}

type ItemWithVariants = Prisma.ItemGetPayload<{
  include: { variants: true }
}>;

export function format(queryResult: ItemWithVariants[]): Formated[] {
  const result: Formated[] = [];

  queryResult.forEach(item => {
    const base = {
      name: item.name,
      description: item.description ?? "",
      type: item.type,
      price: Number(item.price),
    };

    item.variants.forEach(variant => {
      result.push({
        ...base,
        variant: variant.variant ?? "",
        image: variant.image ?? "",
        quantity: variant.quantity,
      });
    });
  });

  return result;
}
