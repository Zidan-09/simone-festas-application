import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { editVariants } from "../utils/item/edit/editVariants";
import { EditItem } from "../utils/requests/itemRequest";
import { ItemTypes } from "../utils/item/itemTypes";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

type EditItemResult = {
  itemId: string;
  updatedItem: boolean;
  updatedVariants: boolean;
};

export const ItemService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name"));
        const description = String(formData.get("description"));
        const type = formData.get("type") as ItemTypes;
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

        const colors = formData.getAll("variants[][color]");
        const images = formData.getAll("variants[][image]");
        const stocks = formData.getAll("variants[][stockQuantity]");

        const variants = await Promise.all(
          images.map(async (image, index) => {

            if (!(image instanceof File)) {
              throw new Error("Invalid image");
            }

            const blob = await put(
              `items/${name}/${Date.now()}-${image.name}`,
              image,
              { access: "public" }
            );

            return {
              color: String(colors[index]),
              image: blob.url,
              stockQuantity: Number(stocks[index])
            };
          })
        );
  
        await tx.itemVariant.createMany({
          data: variants.map(variant => ({
            itemId: item.id,
            color: variant.color,
            image: variant.image,
            quantity: variant.stockQuantity
          }))
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

  async get(id: string) {
    return await prisma.item.findUnique({
      where: {
        id: id
      },
      include: {
        variants: true
      }
    });
  },

  async getAll() {
    return await prisma.item.findMany({
      include: {
        variants: true
      }
    });
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
        where: { id }
      });
    } catch {
      throw {
        statusCode: 400,
        message: ItemResponses.ITEM_DELETED_ERROR
      }
    }
  }
}