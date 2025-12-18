import { prisma } from "../prisma";
import { editVariants } from "../utils/item/edit/editVariants";
import { CreateItem, EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";

type EditItemResult = {
  itemId: string;
  updatedItem: boolean;
  updatedVariants: boolean;
};

export const ItemService = {
  async create({ main, variants }: CreateItem) {
    try {
      return await prisma.$transaction(async (tx) => {
        const item = await tx.item.create({
          data: {
            name: main.name,
            description: main.description,
            type: main.type,
            price: main.price
          }
        });
  
        const variantsCreated = await tx.itemVariant.createMany({
          data: variants.map(variant => ({
            itemId: item.id,
            color: variant.color,
            image: variant.image,
            quantity: variant.stockQuantity
          }))
        });
  
        return {
          main: item,
          variants: variantsCreated
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

  async edit(newData: EditItem): Promise<EditItemResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const currentItem = await tx.item.findUnique({
          where: { id: newData.main.id }
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