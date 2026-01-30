import { ItemType } from "@prisma/client";
import { ItemSearchPayload, ItemService } from "../services/item.service";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { AppError } from "../withError";

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
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const variants = JSON.parse(
      formData.get("variants") as string
    );

    if (!Array.isArray(variants) || variants.length === 0) throw new AppError(400, ServerResponses.INVALID_INPUT);

    variants.forEach((variant) => {
      if (
        !variant.variant ||
        !variant.quantity ||
        !variant.image ||
        variant.keyWords.length === 0
      ) {
        throw new AppError(400, ServerResponses.INVALID_INPUT);
      }

      const image = formData.get(variant.image);

      if (!(image instanceof File)) new AppError(400, ServerResponses.INVALID_INPUT);
    });

    const verifyItem = await ItemService.getByName(String(name));

    if (verifyItem) throw new AppError(409, ItemResponses.ITEM_ALREADY_EXISTS);
  },

  async validateEditItem(id: string) {
    if (!id) throw new AppError(400, ServerResponses.INVALID_INPUT);

    await ItemService.get(id);
  },

  async validateDeleteItem(id: string) {
    if (!id) throw new AppError(400, ServerResponses.INVALID_INPUT);

    await ItemService.get(id);
  },

  async validateDeleteVariant(id: string) {
    if (!id) throw new AppError(400, ServerResponses.INVALID_INPUT);

    await ItemService.getVariant(id);
  },

  async validateItemSearch(payload: ItemSearchPayload) {
    if (payload.keyWords.length === 0) throw new AppError(400, ServerResponses.INVALID_INPUT);
  },

  validateGetItemByType(type: ItemType) {
    if (!Object.values(ItemType).includes(type)) throw new AppError(400, ItemResponses.ITEM_INVALID_TYPE);
  }
}