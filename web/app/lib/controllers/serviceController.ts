import { ServiceService } from "../services/serviceService";
import { CreateService } from "../utils/requests/serviceRequest";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { ApiResponse } from "../utils/server/apiResponse";

export const ServiceController = {
  async create(content: CreateService) {
    const result = await ServiceService.create(content);

    return ApiResponse.success(result, ServiceResponses.SERVICE_CREATED, 201);
  },
}