import { ThemeSearchPayload, ThemeService } from "../services/themeService";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ApiResponse } from "../utils/server/apiResponse";
import { ThemeCategory } from "../utils/theme/themeCategory";

export const ThemeController = {
  async create(formData: FormData) {
    const result = await ThemeService.create(formData);

    return ApiResponse.success(result, ThemeResponses.THEME_CREATED, 201);
  },

  async search(query: ThemeSearchPayload) {
    const result = await ThemeService.search(query);

    return ApiResponse.success(result, ThemeResponses.THEMES_FOUND);
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

  async edit(id: string, formData: FormData) {
    const result = await ThemeService.edit(id, formData);

    return ApiResponse.success(result, ThemeResponses.THEME_UPDATED);
  },

  async delete(id: string) {
    const result = await ThemeService.delete(id);

    return ApiResponse.success(result, ThemeResponses.THEME_DELETED);
  }
}