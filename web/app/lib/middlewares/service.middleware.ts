import { ServiceSearchPayload } from "../services/service.service";
import { CreateService } from "../dto/service.request";
import { ServerResponses } from "../utils/responses/serverResponses";
import { AppError } from "../withError";

export const ServiceMiddleware = {
  async validateCreateService(formData: FormData) {
    const { name, icon, price }: CreateService = {
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      icon: formData.get("icon") as File
    }

    if (
      !name ||
      !icon ||
      !(icon instanceof File) ||
      !price
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);
  },

  async validateServiceSearch(payload: ServiceSearchPayload) {
    if (payload.query.length === 0) throw new AppError(400, ServerResponses.INVALID_INPUT);
  }
}