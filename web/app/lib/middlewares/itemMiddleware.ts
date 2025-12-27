import { ItemService } from "../services/itemService";
import { EditItem } from "../utils/requests/itemRequest";
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

    const variants = JSON.parse(
      formData.get("variants") as string
    );

    if (!Array.isArray(variants) || variants.length === 0) {
      throw {
        statusCode: 400,
        message: ServerResponses.INVALID_INPUT,
      };
    }

    variants.forEach((variant, index) => {
      if (
        !variant.color ||
        !variant.stockQuantity ||
        !variant.imageKey
      ) {
        throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT,
        };
      }

      const image = formData.get(variant.imageKey);

      if (!(image instanceof File)) {
        throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT,
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
  },

  async validateDeleteVariant(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const variantToDelete = await ItemService.getVariant(id);

    if (!variantToDelete) throw {
      statusCode: 404,
      message: ItemResponses.ITEM_NOT_FOUND
    }
  },

  async validateItemSearch(query: string) {
    if (!query.trim()) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  }
}