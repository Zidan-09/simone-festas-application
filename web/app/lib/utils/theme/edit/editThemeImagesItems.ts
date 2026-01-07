import { Prisma } from "@prisma/client";
import { ImagePayload } from "@/app/lib/services/themeService";
import { put, del } from "@vercel/blob";
import { ServerResponses } from "../../responses/serverResponses";

export const EditThemeImagesItems = {
  async editThemeImages(
    tx: Prisma.TransactionClient,
    themeId: string,
    newImages: ImagePayload[]
  ): Promise<boolean> {
    let update = false;

    const currentImages = await tx.themeImage.findMany({
      where: { themeId }
    });

    const incomingIds = new Set(
      newImages.filter(img => img.id).map(img => img.id!)
    );

    for (const img of newImages) {
      if (!img.isNewImage) continue;

      if (!(img.image instanceof File)) throw {
        statusCode: 400,
        message: ServerResponses.INVALID_INPUT
      };

      const blob = await put(
        `themes/${themeId}/${crypto.randomUUID()}-${img.image.name}`,
        img.image,
        { access: "public" }
      );

      await tx.themeImage.create({
        data: {
          themeId,
          url: blob.url
        }
      });

      update = true;
    }

    const imagesToDelete = currentImages.filter(
      img => !incomingIds.has(img.id)
    );

    if (imagesToDelete.length > 0) {
      const urlsToDelete = imagesToDelete.map(img => img.url);

      await del(urlsToDelete);

      await tx.themeImage.deleteMany({
        where: {
          id: { in: imagesToDelete.map(img => img.id) }
        }
      });

      update = true;
    }

    return update;
  }
}
