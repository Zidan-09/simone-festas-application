import { Prisma } from "@prisma/client";

export const EditThemeImagesItems = {
  async editThemeImages(
    tx: Prisma.TransactionClient,
    themeId: string,
    newImages: {
      id?: string;
      url: string;
    }[]
  ) {
    const currentImages = await tx.themeImage.findMany({
      where: { themeId }
    });

    const currentMap = new Map(currentImages.map(img => [img.id, img]));
    const incomingMap = new Map(
      newImages.filter(img => img.id).map(img => [img.id!, img])
    );

    for (const img of newImages) {
      if (!img.id) continue;

      const current = currentMap.get(img.id);
      if (!current) continue;

      if (current.url !== img.url) {
        await tx.themeImage.update({
          where: { id: img.id },
          data: { url: img.url }
        });
      }
    }

    const imagesToCreate = newImages.filter(img => !img.id);

    if (imagesToCreate.length > 0) {
      await tx.themeImage.createMany({
        data: imagesToCreate.map(img => ({
          themeId,
          url: img.url
        }))
      });
    }

    const imagesToDelete = currentImages.filter(
      img => !incomingMap.has(img.id)
    );

    if (imagesToDelete.length > 0) {
      await tx.themeImage.deleteMany({
        where: {
          id: { in: imagesToDelete.map(img => img.id) }
        }
      });
    }
  },

  async editThemeItems(
    tx: Prisma.TransactionClient,
    themeId: string,
    newItems: {
      itemId: string;
      quantity: number;
    }[]
  ) {
    const currentItems = await tx.themeItem.findMany({
      where: { themeId }
    });

    const currentMap = new Map(
      currentItems.map(i => [i.itemId, i])
    );

    const incomingMap = new Map(
      newItems.map(i => [i.itemId, i])
    );

    for (const item of newItems) {
      const current = currentMap.get(item.itemId);
      if (!current) continue;

      if (current.quantity !== item.quantity) {
        await tx.themeItem.update({
          where: { id: current.id },
          data: { quantity: item.quantity }
        });
      }
    }

    const itemsToCreate = newItems.filter(
      i => !currentMap.has(i.itemId)
    );

    if (itemsToCreate.length > 0) {
      await tx.themeItem.createMany({
        data: itemsToCreate.map(i => ({
          themeId,
          itemId: i.itemId,
          quantity: i.quantity
        }))
      });
    }

    const itemsToDelete = currentItems.filter(
      i => !incomingMap.has(i.itemId)
    );

    if (itemsToDelete.length > 0) {
      await tx.themeItem.deleteMany({
        where: {
          id: { in: itemsToDelete.map(i => i.id) }
        }
      });
    }
  }
}
