import { ItemVariant, Prisma } from "@prisma/client";
import { ItemResponses } from "../responses/itemResponses";
import { ServiceResponses } from "../responses/serviceResponses.";
import { AppError } from "../../withError";

export async function getTotal(tx: Prisma.TransactionClient, items: ItemVariant[], service?: string): Promise<number> {
  const itemIds = items.map(i => i.itemId);

  const itemsOnDb = await tx.item.findMany({
    where: {
      id: { in: itemIds }
    }
  });

  if (itemsOnDb.length !== itemIds.length) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

  const itemPriceMap = new Map(
    itemsOnDb.map(item => [item.id, Number(item.price)])
  );

  let total = 0;
  
  for (const { itemId, quantity } of items) {
    const price = itemPriceMap.get(itemId);

    if (price === undefined) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    total += price * quantity;
  }

  if (service) {
    const serviceOnDb = await tx.service.findUnique({
      where: { id: service }
    });

    if (!serviceOnDb) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

    total += Number(serviceOnDb.price);
  }
  
  return total;
}