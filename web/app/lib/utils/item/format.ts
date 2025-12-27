import { Prisma, ItemType } from "@prisma/client";

type Formated = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  price: number;
  vid: string;
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
      });
    });
  });

  return result;
}
