import { ServiceSearchPayload } from "../services/serviceService";
import { CreateService } from "../utils/requests/serviceRequest";
import { ServerResponses } from "../utils/responses/serverResponses";

export const ServiceMiddleware = {
  async validateCreateService(content: CreateService) {
    if (
      !content.name ||
      !content.price
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  },

  async validateServiceSearch(payload: ServiceSearchPayload) {
    if (payload.query.length === 0) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  }
}