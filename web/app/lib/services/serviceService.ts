import { prisma } from "../prisma";
import { CreateService } from "../utils/requests/serviceRequest";
import { ServiceResponses } from "../utils/responses/serviceResponses.";

export const ServiceService = {
  async create(content: CreateService) {
    try {
      return await prisma.service.create({
        data: {
          name: content.name,
          price: content.price
        }
      });

    } catch {
      throw {
        statusCode: 400,
        message: ServiceResponses.SERVICE_CREATED_ERROR
      }
    }
  }
}