import { ItemType, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { EditItem } from "../../requests/itemRequest";

export async function editVariants(
  tx: Prisma.TransactionClient,
  currentItem: {
    id: string;
    name: string;
    description: string | null;
    type: ItemType;
    price: Decimal;
    createdAt: Date | null;
  },
  newData: EditItem
) {
  const currentVariants = await tx.itemVariant.findMany({
    where: { itemId: currentItem.id },
  });

  const currentVariantsMap = new Map(currentVariants.map((v) => [v.id, v]));

  const incomingVariantsMap = new Map(
    newData.variants.filter((v) => v.id).map((v) => [v.id!, v])
  );

  for (const variant of newData.variants) {
    if (!variant.id) continue;

    const current = currentVariantsMap.get(variant.id);
    if (!current) continue;

    const hasChanged =
      current.variant !== variant.variant ||
      current.image !== variant.image ||
      current.quantity !== variant.stockQuantity;

    if (hasChanged) {
      await tx.itemVariant.update({
        where: { id: variant.id },
        data: {
          variant: variant.variant,
          image: variant.image,
          quantity: variant.stockQuantity,
        },
      });
    }
  }

  const newVariants = newData.variants.filter((v) => !v.id);

  if (newVariants.length > 0) {
    await tx.itemVariant.createMany({
      data: newVariants.map((v) => ({
        itemId: currentItem.id,
        variant: v.variant,
        image: v.image,
        stockQuantity: v.stockQuantity,
      })),
    });
  }

  const variantsToDelete = currentVariants.filter(
    (v) => !incomingVariantsMap.has(v.id)
  );

  if (variantsToDelete.length > 0) {
    await tx.itemVariant.deleteMany({
      where: {
        id: { in: variantsToDelete.map((v) => v.id) },
      },
    });
  }
}
