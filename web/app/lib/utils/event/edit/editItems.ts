import { Prisma } from "@prisma/client";
import { EventPayload } from "../../requests/event.request";

export async function editItems(
  tx: Prisma.TransactionClient,
  items: EventPayload["items"],
  eventId: string
): Promise<boolean> {
  let update = false;

  const currentItems = await tx.eventItem.findMany({
    where: { eventId: eventId }
  });

  const currentItemsMap = new Map(currentItems.map((i) => [i.itemVariantId, i]));

  for (const item of items) {
    const current = currentItemsMap.get(item.id);

    if (current) {
      if (item.quantity !== current.quantity) {
        await tx.eventItem.update({
          where: { id: current.id },
          data: { quantity: item.quantity }
        });

        update = true;
      };

    } else {
      await tx.eventItem.create({
        data: {
          eventId,
          itemVariantId: item.id,
          quantity: item.quantity
        }
      });

      update = true;
    };
  };

  const itemsIds = new Set(items.map(item => item.id));

  const itemsToDelete = currentItems
    .filter(item => !itemsIds.has(item.itemVariantId))
    .map(item => item.itemVariantId);

  if (itemsToDelete.length > 0) {
    await tx.eventItem.deleteMany({
      where: {
        eventId,
        itemVariantId: { in: itemsToDelete }
      }
    });

    update = true;
  }

  return update;
};