import { ItemType, Prisma } from "@prisma/client"
import { prisma } from "../prisma";
import { put, del } from "@vercel/blob";
import { editVariants } from "../utils/item/edit/editVariants";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { format } from "../utils/item/format";
import { Decimal } from "@prisma/client/runtime/client";
import { normalizeKeywords } from "../utils/server/normalizeKeywords";
import { expandKeyword } from "../utils/server/expandKeyword";
import { onlyFinalKeywords } from "../utils/server/onlyFinalKeywords";
import { AppError } from "../withError";

type EditItemResult = {
  itemId: string;
  updatedItem: boolean;
  updatedVariants: boolean;
};

export type VariantPayload = {
  id?: string;
  variant: string;
  quantity: number;
  image: string;
  isNewImage: boolean;
  keyWords: string[];
};

export type ItemSearchPayload = {
  keyWords: string;
  filter?: ItemType[];
};

type ItemWithVariants = Prisma.ItemGetPayload<{
  include: { variants: true }
}>;

export const ItemService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name")).trim().normalize("NFC").toLowerCase();
        const description = String(formData.get("description")).trim().normalize("NFC").toLowerCase();
        const type = formData.get("type") as ItemType;
        const price = Number(formData.get("price"));

        if (!name || !description || !price || !type) throw new AppError(400, ServerResponses.INVALID_INPUT);

        const item = await tx.item.create({
          data: {
            name: name,
            description: description,
            type: type,
            price: price
          }
        });

        const variants = JSON.parse(
          formData.get("variants") as string
        ) as VariantPayload[];

        const variantsWithImages = await Promise.all(
          variants.map(async (variant) => {
            const image = formData.get(variant.image);

            if (!(image instanceof File)) throw new AppError(400, ServerResponses.INVALID_INPUT);

            const blob = await put(
              `items/${item.id}/${crypto.randomUUID()}-${image.name}`,
              image,
              { access: "public" }
            );

            return {
              itemId: item.id,
              variant: variant.variant,
              image: blob.url,
              quantity: variant.quantity,
              keyWords: Array.from(
                new Set(variant.keyWords.flatMap(normalizeKeywords).flatMap(expandKeyword))
              )
            };
          })
        );
  
        await tx.itemVariant.createMany({
          data: variantsWithImages
        });
  
        return {
          main: item,
          variants: variants
        };
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, ItemResponses.ITEM_CREATED_ERROR);
    }
  },

  async getByName(name: string) {
    const item = await prisma.item.findUnique({
      where: {
        name: name.trim().normalize("NFC").toLowerCase()
      },
      include: {
        variants: true
      }
    });

    return item;
  },

  async getByType(type: ItemType) {
    const items = await prisma.item.findMany({
      where: {
        type
      },
      include: {
        variants: true
      }
    });

    return format(items.slice(0, 9));
  },

  async getVariant(id: string) {
    const variant = await prisma.itemVariant.findUnique({
      where: {
        id: id
      }
    });

    if (!variant) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    return {
      ...variant,
      keyWords: onlyFinalKeywords(variant.keyWords)
    };
  },

  async getVariantToModal(id: string) {
    const variant = await prisma.itemVariant.findUnique({
      where: {
        id
      },
      include: {
        item: true
      }
    });

    if (!variant) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    return {
      id: id,
      name: variant.item.name,
      description: variant.item.description,
      price: variant.item.price,
      type: variant.item.type,
      variant: variant.variant,
      image: variant.image,
    }
  },

  async get(id: string): Promise<ItemWithVariants> {
    const item = await prisma.item.findUnique({
      where: {
        id: id
      },
      include: {
        variants: true
      }
    });

    if (!item) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    const foramttedVariants = item.variants.map(variant => ({
      ...variant,
      keyWords: onlyFinalKeywords(variant.keyWords)
    }));

    return {
      ...item,
      variants: foramttedVariants
    };
  },

  async getAll() {
    const items =  await prisma.item.findMany({
      include: {
        variants: true
      }
    });

    return format(items);
  },

  async edit(id: string, formData: FormData): Promise<EditItemResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name"));
        const description = String(formData.get("description"));
        const type = formData.get("type") as ItemType;
        const price = new Decimal(Number(formData.get("price")));
  
        if (!name || !description || !price || !type) throw new AppError(400, ServerResponses.INVALID_INPUT);

        const currentItem = await tx.item.findUnique({
          where: { id }
        });

        if (!currentItem) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);
        
        let itemUpdated = false;
        let variantsUpdated = false;

        if (
          currentItem.name !== name ||
          currentItem.description !== description ||
          currentItem.type !== type ||
          !currentItem.price.equals(price)
        ) {
          await tx.item.update({
            where: { id: currentItem.id },
            data: {
              name: name,
              description: description,
              type: type,
              price: price
            }
          });

          itemUpdated = true;
        }

        const variants = JSON.parse(
          formData.get("variants") as string
        ) as VariantPayload[];

        variantsUpdated = await editVariants(tx, currentItem, variants, formData);

        return {
          itemId: currentItem.id,
          updatedItem: itemUpdated,
          updatedVariants: variantsUpdated
        };
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, ItemResponses.ITEM_UPDATED_ERROR);
    }
  },

  async delete(id: string) {
    try {
      const item = await prisma.item.findUnique({
        where: { id },
        include: { variants: true }
      });

      if (item) {
        const urls = item.variants.map(v => v.image).filter((url): url is string => !!url);
        if (urls.length > 0) await del(urls);
      }

      return await prisma.item.delete({ where: { id } });
    } catch {
      throw new AppError(400, ItemResponses.ITEM_DELETED_ERROR);
    }
  },

  async deleteVariant(id: string) {
    try {
      const variant = await prisma.itemVariant.findUnique({ where: { id } });

      const itemId = variant?.itemId;

      const item = await prisma.item.findUnique({
        where: {
          id: itemId
        },
        include: {
          variants: true
        }
      });

      if (variant?.image) await del(variant.image);

      if (item?.variants.length === 1) return await this.delete(itemId!);
      
      return await prisma.itemVariant.delete({ where: { id } });

    } catch {
      throw new AppError(400, ItemResponses.ITEM_DELETED_ERROR);
    }
  },

  async search(payload: ItemSearchPayload) {
    const keySearch = {
      keyWords: {
        hasSome: normalizeKeywords(payload.keyWords)
      }
    };

    const result = await prisma.itemVariant.findMany({
      where: payload.filter && payload.filter.length > 0
      ? {
        AND: [
          keySearch,
          {
            item: {
              type: {
                in: payload.filter
              }
            }
          }
        ]
      }
      : keySearch,
      include: {
        item: true
      }
    });
  
    return result.map(item => ({
      ...item,
      keyWords: onlyFinalKeywords(item.keyWords)
    }));
  }
}