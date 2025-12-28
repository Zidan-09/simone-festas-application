import { ItemType } from "@prisma/client";
import { ItemService } from "../services/itemService";
import { EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const ItemController = {
  async create(formData: FormData) {
    const result = await ItemService.create(formData);
    
    return ApiResponse.success(result, ItemResponses.ITEM_CREATED, 201);
  },

  async getItem(id: string) {
    const result = await ItemService.get(id);

    return ApiResponse.success(result, ItemResponses.ITEM_FOUND);
  },

  async getTypeItem(type: ItemType) {
    const result = await ItemService.getByType(type);

    return ApiResponse.success(result, ItemResponses.ITEMS_FOUND);
  },

  async getAll() {
    const result = await ItemService.getAll();

    return ApiResponse.success(result, ItemResponses.ITEMS_FOUND);
  },

  async edit(id: string, data: EditItem) {
    const result = await ItemService.edit(id, data);

    return ApiResponse.success(result, ItemResponses.ITEM_UPDATED);
  },

  async delete(id: string) {
    const result = await ItemService.delete(id);
  
    return ApiResponse.success(result, ItemResponses.ITEM_DELETED);
  },

  async deleteVariant(id: string) {
    const result = await ItemService.deleteVariant(id);

    return ApiResponse.success(result, ItemResponses.ITEM_VARIANT_DELETED);
  },

  async search(query: string) {
    const result = await ItemService.search(query);
    
    return ApiResponse.success(result, ItemResponses.ITEMS_FOUND);
  }
}