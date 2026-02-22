import { Prisma } from "@prisma/client";
import { ItemResponses } from "../responses/itemResponses";
import { ServiceResponses } from "../responses/serviceResponses.";
import { AppError } from "../../withError";
import { EventPayload } from "../requests/event.request";
import { calculatePriceTable } from "./calculatePriceTable";

export async function getTotal(tx: Prisma.TransactionClient, payload: EventPayload): Promise<number> {
  let total = 0;

  switch (payload.eventType) {
    case "ITEMS":
      const variants = await tx.itemVariant.findMany({
        where: {
          id: { in: payload.items.map(i => i.id) }
        },
        include: {
          item: {
            select: {
              price: true
            }
          }
        }
      });

      const itemPriceMap = new Map<string, number>(
        variants.map(v => ([v.id, Number(v.item.price)]))
      );

      for (const { id, quantity } of payload.items) {
        const price = itemPriceMap.get(id);

        if (price === undefined) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

        total += price * (quantity ?? 1);
      }

      break;

    case "KIT":
      total = payload.kitType === "SIMPLE" ? 130 : 200;

      break;
    case "TABLE":
      total = calculatePriceTable(payload.numberOfPeople);

      break;

  }

  if (payload.service) {
    const serviceOnDb = await tx.service.findUnique({
      where: { id: payload.service }
    });

    if (!serviceOnDb) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

    total += Number(serviceOnDb.price);
  }
  
  return total;
}