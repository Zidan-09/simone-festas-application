import { ItemTypes } from "../utils/item/itemTypes";
import { prisma } from "../prisma";

export const ItemService = {
  async create(name: string, description: string, type: ItemTypes, price: number) {
    const result = await prisma.item.create({
      data: {
        name: name,
        description: description,
        type: type,
        price: price
      }
    });
    
    return result;
  },

  async getAll() {
    const result = await prisma.item.findMany();
    return result;
  },

  async delete(id: string) {
    try {
      const result = await prisma.item.delete({
        where: {
          id: id
        }
      });

      return result;

    } catch (err) {
      console.error(err);
      return "Deu pau"
    }
  }
}