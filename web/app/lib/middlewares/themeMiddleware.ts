import { ServerResponses } from "../utils/responses/serverResponses"
import { ThemeResponses } from "../utils/responses/themeResponses"
import { ThemeCategory } from "../utils/theme/themeCategory"

export const ThemeMiddleware = {
  async validateGetTheme(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  },

  async validateDeleteTheme(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  },

  async validateGetByCategory(category: ThemeCategory) {
    const ThemeTypes = Object.values(ThemeCategory);

    if (!ThemeTypes.includes(category)) throw {
      statusCode: 400,
      message: ThemeResponses.THEME_INVALID_TYPE
    }
  }
}