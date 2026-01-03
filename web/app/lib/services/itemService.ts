import { ItemType } from "@prisma/client/"
import { prisma } from "../prisma";
import { put, del } from "@vercel/blob";
import { editVariants } from "../utils/item/edit/editVariants";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { format } from "../utils/item/format";
import { Decimal } from "@prisma/client/runtime/client";

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
};

export const ItemService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name"));
        const description = String(formData.get("description"));
        const type = formData.get("type") as ItemType;
        const price = Number(formData.get("price"));

        if (!name || !description || !price || !type) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        }

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

            if (!(image instanceof File)) throw {
              statusCode: 400,
              message: ServerResponses.INVALID_INPUT
            };

            const blob = await put(
              `items/${name}/${Date.now()}-${image.name}`,
              image,
              { access: "public" }
            );
            return {
              itemId: item.id,
              variant: variant.variant,
              image: blob.url,
              quantity: variant.quantity
            };
          })
        )
  
        await tx.itemVariant.createMany({
          data: variantsWithImages
        });
  
        return {
          main: item,
          variants: variants
        };
      });

    } catch {
      throw {
        statusCode: 400,
        message: ItemResponses.ITEM_CREATED_ERROR
      }
    }
  },

  async getByName(name: string) {
    return await prisma.item.findUnique({
      where: {
        name: name
      },
      include: {
        variants: true
      }
    })
  },

  async getByType(type: ItemType) {
    const items = await prisma.item.findMany({
      where: {
        type: type
      },
      include: {
        variants: true
      }
    });

    return format(items.slice(0, 9));
  },

  async getVariant(id: string) {
    return await prisma.itemVariant.findUnique({
      where: {
        id: id
      }
    });
  },

  async get(id: string) {
    const item = await prisma.item.findUnique({
      where: {
        id: id
      },
      include: {
        variants: true
      }
    });

    if (!item) throw {
      statusCode: 404,
      message: ItemResponses.ITEM_NOT_FOUND
    }

    return item;
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
  
        if (!name || !description || !price || !type) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        }

        const currentItem = await tx.item.findUnique({
          where: { id: id }
        });

        if (!currentItem) throw {
          statusCode: 404,
          message: ItemResponses.ITEM_NOT_FOUND
        };
        
        let itemUpdated = false;
        let variantsUpdated = false;

        if (
          currentItem.name !== name ||
          currentItem.description !== description ||
          currentItem.type !== type ||
          currentItem.price !== price
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

        if (variants.length > 0) {
          await editVariants(tx, currentItem, variants, formData);
          variantsUpdated = true;
        }

        return {
          itemId: currentItem.id,
          updatedItem: itemUpdated,
          updatedVariants: variantsUpdated
        };
      });
    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 400,
        message: ItemResponses.ITEM_UPDATED_ERROR
      }
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
      throw { statusCode: 400, message: ItemResponses.ITEM_DELETED_ERROR };
    }
  },

  async deleteVariant(id: string) {
    try {
      const variant = await prisma.itemVariant.findUnique({ where: { id } });
      if (variant?.image) await del(variant.image);

      return await prisma.itemVariant.delete({ where: { id } });
    } catch {
      throw { statusCode: 400, message: ItemResponses.ITEM_DELETED_ERROR };
    }
  },

  async search(query: string) {
    const items = await prisma.item.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      },
      include: {
        variants: true
      }
    });

    return format(items);
  }
}