import { ItemService } from "../services/itemService";
import { CreateItem, EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const ItemMiddleware = {
  async validateCreateItem(formData: FormData) {
    const name = formData.get("name");
    const description = formData.get("description");
    const type = formData.get("type");
    const price = formData.get("price");

    if (
      !name ||
      !description ||
      !price ||
      !type
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const variantsColors = formData.getAll("variants[][color]");
    const variantsStocks = formData.getAll("variants[][stockQuantity]");
    const variantsImages = formData.getAll("variants[][image]");

    if (
      variantsColors.length === 0 ||
      variantsStocks.length === 0 ||
      variantsImages.length === 0
    ) {
      throw {
        statusCode: 400,
        message: ServerResponses.INVALID_INPUT
      };
    }

    variantsImages.forEach((img, index) => {
      if (
        !variantsColors[index] ||
        !variantsStocks[index] ||
        !(img instanceof File)
      ) {
        throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        };
      }
    });

    const verifyItem = await ItemService.getByName(String(name));

    if (verifyItem) throw {
      statusCode: 409,
      message: ItemResponses.ITEM_ALREADY_EXISTS
    }
  },

  async validateEditItem(id: string, input: EditItem) {
    if (
      !id ||
      !input
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const itemToEdit = await ItemService.get(id);

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