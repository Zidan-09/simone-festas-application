import { ItemService } from "../services/itemService";
import { CreateItem, EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const ItemMiddleware = {
  async validateCreateItem(input: CreateItem) {
    if (
      !input.main.name ||
      !input.main.price ||
      !input.main.type ||
      input.variants.length <= 0 ||
      !input.variants.every(i => i)
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const verifyItem = await ItemService.getByName(input.main.name);

    if (verifyItem) throw {
      statusCode: 409,
      message: ItemResponses.ITEM_ALREADY_EXISTS
    }
  },

  async validateEditItem(input: EditItem) {
    if (
      !input.main.id
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const itemToEdit = await ItemService.get(input.main.id);

    if (!itemToEdit) throw {
      statusCode: 404,
      message: ItemResponses.ITEM_NOT_FOUND
    }
  },

  async validateDeleteItem(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const itemToDelete = await ItemService.get(id);

    if (!itemToDelete) throw {
      statusCode: 404,
      message: ItemResponses.ITEM_NOT_FOUND
    }
  }
}