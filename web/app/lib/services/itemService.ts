import { ItemType } from "@prisma/client/"
import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { editVariants } from "../utils/item/edit/editVariants";
import { EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { format } from "../utils/item/format";

type EditItemResult = {
  itemId: string;
  updatedItem: boolean;
  updatedVariants: boolean;
};

type VariantPayload = {
  variant: string;
  stockQuantity: number;
  imageKey: string;
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
            const image = formData.get(variant.imageKey);

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
              quantity: variant.stockQuantity
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

  async edit(id: string, newData: EditItem): Promise<EditItemResult> {
    try {
      return await prisma.$transaction(async (tx) => {
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
          currentItem.name !== newData.main.name ||
          currentItem.description !== newData.main.description ||
          currentItem.type !== newData.main.type ||
          currentItem.price !== newData.main.price
        ) {
          await tx.item.update({
            where: { id: currentItem.id },
            data: {
              name: newData.main.name,
              description: newData.main.description,
              type: newData.main.type,
              price: newData.main.price
            }
          });

          itemUpdated = true;
        }

        if (newData.variants.length > 0) {
          await editVariants(tx, currentItem, newData);
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
      return await prisma.item.delete({
        where: {
          id: id
        }
      });
    } catch {
      throw {
        statusCode: 400,
        message: ItemResponses.ITEM_DELETED_ERROR
      }
    }
  },

  async deleteVariant(id: string) {
    try {
      return await prisma.itemVariant.delete({
        where: {
          id: id
        }
      });
    } catch {
      throw {
        statusCode: 400,
        message: ItemResponses.ITEM_DELETED_ERROR
      }
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