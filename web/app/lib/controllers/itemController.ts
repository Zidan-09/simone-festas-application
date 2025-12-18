import { ItemService } from "../services/itemService";
import { CreateItem, EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const ItemController = {
  async create(content: CreateItem) {
    const result = await ItemService.create(content);
    
    if (result) return ApiResponse.server(true, ItemResponses.ITEM_CREATED, 201, result);

    return ApiResponse.server(false, ItemResponses.ITEM_CREATED_ERROR, 400);
  },

  async getItem(id: string) {
    const result = await ItemService.get(id);

    if (result) return ApiResponse.server(true, ItemResponses.ITEM_FOUND, 200, result);

    return ApiResponse.server(false, ItemResponses.ITEM_NOT_FOUND, 404);
  },

  async getAll() {
    const result = await ItemService.getAll();

    return ApiResponse.server(true, ItemResponses.ITEMS_FOUND, 200, result);
  },

  async edit(data: EditItem) {
    try {
      const result = await ItemService.edit(data);

      return ApiResponse.server(true, ItemResponses.ITEM_UPDATED, 200, result);

    } catch (err) {
      return ApiResponse.server(false, ItemResponses.ITEM_UPDATED_ERROR, 400);
    }
  },

  async delete(id: string) {
    try {
      const result = await ItemService.delete(id);
  
      return ApiResponse.server(true, ItemResponses.ITEM_DELETED, 200, result);
    } catch (err) {
      return ApiResponse.server(false, ItemResponses.ITEM_DELETED_ERROR, 400);
    }
  }
}