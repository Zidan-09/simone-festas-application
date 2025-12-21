import { ThemeService } from "../services/themeService";
import { CreateTheme, EditTheme } from "../utils/requests/themeRequest";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ApiResponse } from "../utils/server/apiResponse";
import { ThemeCategory } from "../utils/theme/themeCategory";

export const ThemeController = {
  async create(content: CreateTheme) {
    const result = await ThemeService.create(content);

    return ApiResponse.success(result, ThemeResponses.THEME_CREATED, 201);
  },

  async getTheme(id: string) {
    const result = await ThemeService.get(id);

    return ApiResponse.success(result, ThemeResponses.THEME_FOUND);
  },

  async getAll() {
    const result = await ThemeService.getAll();

    return ApiResponse.success(result, ThemeResponses.THEMES_FOUND);
  },

  async getCategoryThemes(category: ThemeCategory) {
    const result = await ThemeService.getType(category);

    return ApiResponse.success(result, ThemeResponses.THEMES_FOUND);
  },

  async edit(id: string, content: EditTheme) {
    const result = await ThemeService.edit(id, content);

    return ApiResponse.success(result, ThemeResponses.THEME_UPDATED);
  },

  async delete(id: string) {
    const result = await ThemeService.delete(id);

    return ApiResponse.success(result, ThemeResponses.THEME_DELETED);
  }
}