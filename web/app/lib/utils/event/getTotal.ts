import { ItemVariant, Prisma } from "@prisma/client";
import { ItemResponses } from "../responses/itemResponses";
import { ServiceResponses } from "../responses/serviceResponses.";
import { AppError } from "../../withError";

export async function getTotal(tx: Prisma.TransactionClient, items: ItemVariant[], services: string[]): Promise<number> {
  let total = 0;
  
  for (const i of items) {
    const item = await tx.item.findUnique({
      where: { id: i.itemId }
    });

    if (!item) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    total += (i.quantity * Number(item.price));
  }

  for (const s of services) {
    const service = await tx.service.findUnique({
      where: { id: s }
    });

    if (!service) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

    total += Number(service.price);
  }

  return total;
}