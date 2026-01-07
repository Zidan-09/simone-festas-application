import { ItemType, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { VariantPayload } from "@/app/lib/services/itemService";
import { put, del } from "@vercel/blob";
import { normalizeKeywords } from "../../server/normalizeKeywords";

export async function editVariants(
  tx: Prisma.TransactionClient,
  currentItem: {
    id: string;
    name: string;
    description: string | null;
    type: ItemType;
    price: Decimal;
  },
  variants: VariantPayload[],
  formData: FormData
): Promise<boolean> {
  let update: boolean = false;

  const currentVariants = await tx.itemVariant.findMany({
    where: { itemId: currentItem.id },
  });
  const currentVariantsMap = new Map(currentVariants.map((v) => [v.id, v]));

  for (const variant of variants) {
    let finalImageUrl = variant.image;
    const current = variant.id ? currentVariantsMap.get(variant.id) : null;

    if ((variant).isNewImage) {
      const file = formData.get(variant.image);
      if (file instanceof File) {
        const blob = await put(
          `items/${currentItem.id}/${crypto.randomUUID()}-${file.name}`,
          file,
          { access: "public" }
        );
        finalImageUrl = blob.url;

        if (current?.image) await del(current.image);

        update = true;
      }
    }

    if (variant.id && currentVariantsMap.has(variant.id)) {
      const current = currentVariantsMap.get(variant.id)!;
      
      const hasChanged = 
        current.variant !== variant.variant || 
        current.image !== finalImageUrl || 
        current.quantity !== variant.quantity;

      if (hasChanged) {
        await tx.itemVariant.update({
          where: { id: variant.id },
          data: {
            variant: variant.variant.normalize("NFC").toLowerCase(),
            image: finalImageUrl,
            quantity: variant.quantity,
            keyWords: Array.from(
              new Set(variant.keyWords.flatMap(normalizeKeywords))
            )
          },
        });

        update = true;
      };
    } else {
      await tx.itemVariant.create({
        data: {
          itemId: currentItem.id,
          variant: variant.variant.normalize("NFC").toLowerCase(),
          image: finalImageUrl,
          quantity: variant.quantity,
          keyWords: Array.from(
            new Set(variant.keyWords.flatMap(normalizeKeywords))
          )
        },
      });

      update = true;
    }
  }

  const incomingIds = new Set(variants.map((v) => v.id).filter(Boolean));
  const variantsToDelete = currentVariants.filter((v) => !incomingIds.has(v.id));

  if (variantsToDelete.length > 0) {
    const urlsToDelete = variantsToDelete.map(v => v.image).filter((url): url is string => !!url);

    if (urlsToDelete.length > 0) await del(urlsToDelete);

    await tx.itemVariant.deleteMany({
      where: {
        id: { in: variantsToDelete.map((v) => v.id) },
      },
    });

    update = true;
  }

  return update;
}