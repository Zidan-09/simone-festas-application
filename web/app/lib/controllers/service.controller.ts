import { ServiceSearchPayload, ServiceService } from "../services/service.service";
import { KitType } from "../utils/requests/event.request";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { ApiResponse } from "../utils/server/apiResponse";

export const ServiceController = {
  async create(formData: FormData) {
    const result = await ServiceService.create(formData);

    return ApiResponse.success(result, ServiceResponses.SERVICE_CREATED, 201);
  },

  async getService(id: string) {
    const result = await ServiceService.get(id);

    return ApiResponse.success(result, ServiceResponses.SERVICE_FOUND);
  },
  
  async getAll(kitType: KitType) {
    const result = await ServiceService.getAll(kitType);

    return ApiResponse.success(result, ServiceResponses.SERVICES_FOUND);
  },

  async edit(id: string, formData: FormData) {
    const result = await ServiceService.edit(id, formData);

    return ApiResponse.success(result, ServiceResponses.SERVICE_UPDATED);
  },

  async delete(id: string) {
    const result = await ServiceService.delete(id);

    return ApiResponse.success(result, ServiceResponses.SERVICE_DELETED);
  },
  
  async search(search: ServiceSearchPayload) {
    const result = await ServiceService.search(search);

    return ApiResponse.success(result, ServiceResponses.SERVICES_FOUND);
  }
}