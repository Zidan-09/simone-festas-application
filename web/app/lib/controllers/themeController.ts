import { ThemeService } from "../services/themeService";
import { CreateTheme, EditTheme } from "../utils/requests/themeRequest";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const ThemeController = {
  async create(content: CreateTheme) {
    const result = await ThemeService.create(content);

    return ApiResponse.success(result, ThemeResponses.THEME_CREATED, 201);
  },

  async read() {

  },

  async edit(content: EditTheme) {
    const result = await ThemeService.edit(content);

    return ApiResponse.success(result, ThemeResponses.THEME_UPDATED);
  },

  async delete(id: string) {
    
  }
}