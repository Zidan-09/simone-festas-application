import { Prisma, ItemType } from "@/app/generated/prisma/client";

type Formated = {
  name: string;
  description: string;
  type: ItemType;
  price: number;
  color: string;
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
        color: variant.color ?? "",
        image: variant.image ?? "",
        quantity: variant.quantity,
      });
    });
  });

  return result;
}
