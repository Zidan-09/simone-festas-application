import { ServerResponses } from "../utils/responses/serverResponses"

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
  }
}