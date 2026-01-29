import { ServiceSearchPayload } from "../services/service.service";
import { CreateService } from "../utils/requests/service.request";
import { ServerResponses } from "../utils/responses/serverResponses";
import { AppError } from "../withError";

export const ServiceMiddleware = {
  async validateCreateService(content: CreateService) {
    if (
      !content.name ||
      !content.price
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);
  },

  async validateServiceSearch(payload: ServiceSearchPayload) {
    if (payload.query.length === 0) throw new AppError(400, ServerResponses.INVALID_INPUT);
  }
}