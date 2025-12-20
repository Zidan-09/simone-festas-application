import { ItemService } from "../services/itemService";
import { CreateItem, EditItem } from "../utils/requests/itemRequest";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const ItemController = {
  async create(content: CreateItem) {
    const result = await ItemService.create(content);
    
    return ApiResponse.success(result, ItemResponses.ITEM_CREATED, 201);
  },

  async getItem(id: string) {
    const result = await ItemService.get(id);

    return ApiResponse.success(result, ItemResponses.ITEM_FOUND);
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
  }
}