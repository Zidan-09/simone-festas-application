import { ItemService } from "../services/item.service";
import { ThemeService } from "../services/theme.service"
import { KitType } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const KitController = {
  async getThemeAndTables(kitType: KitType) {
    const themes = await ThemeService.getAll();

    const tables = await ItemService.getByType("TABLE");

    const result = { themes, tables };

    return ApiResponse.success(result, ItemResponses.ITEMS_FOUND);
  }
}