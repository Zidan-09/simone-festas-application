import { ItemService } from "../services/itemService";
import { ItemTypes } from "../utils/item/itemTypes";
import { ApiResponse } from "../utils/server/apiResponse";

export const ItemController = {
  async create(name: string, description: string, type: ItemTypes, price: number) {
    const result = await ItemService.create(name, description, type, price);
    
    return ApiResponse.server(true, "Item cadastrado com sucesso", 201, result);
  },

  async getAll() {
    const result = await ItemService.getAll();

    return ApiResponse.server(true, "Todos os itens", 200, result);
  },

  async delete(id: string) {
    const result = await ItemService.delete(id);

    return ApiResponse.server(true, `id: ${id}`, 200, result);
  }
}