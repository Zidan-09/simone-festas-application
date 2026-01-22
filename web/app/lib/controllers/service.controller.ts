import { ServiceSearchPayload, ServiceService } from "../services/service.service";
import { CreateService, EditService } from "../utils/requests/service.request";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { ApiResponse } from "../utils/server/apiResponse";

export const ServiceController = {
  async create(content: CreateService) {
    const result = await ServiceService.create(content);

    return ApiResponse.success(result, ServiceResponses.SERVICE_CREATED, 201);
  },

  async getService(id: string) {
    const result = await ServiceService.get(id);

    return ApiResponse.success(result, ServiceResponses.SERVICE_FOUND);
  },
  
  async getAll() {
    const result = await ServiceService.getAll();

    return ApiResponse.success(result, ServiceResponses.SERVICES_FOUND);
  },

  async edit(id: string, content: EditService) {
    const result = await ServiceService.edit(id, content);

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