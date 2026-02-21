import { Prisma } from "@prisma/client";
import { EventPayload } from "../requests/event.request";

export async function reserve(tx: Prisma.TransactionClient, payload: EventPayload, eventId: string) {
  switch (payload.eventType) {
    case "ITEMS":
      return await Promise.all(
        payload.items.map(async (item) => {
          return await tx.eventItem.create({
            data: {
              eventId,
              itemVariantId: item.id,
              quantity: item.quantity ?? 1
            }
          });
        })
      );

    case "KIT":
      return await tx.eventKit.create({
        data: {
          eventId,
          tablesId: payload.tables,
          themeId: payload.theme,
          kitType: payload.kitType
        }
      })  

    case "TABLE":
      return await tx.eventTable.create({
        data: {
          eventId,
          colorId: payload.colorToneId,
          numberOfPeople: payload.numberOfPeople
        }
      })
  }
}