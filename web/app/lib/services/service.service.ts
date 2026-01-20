import { prisma } from "../prisma";
import { CreateService, EditService } from "../utils/requests/serviceRequest";
import { ServiceResponses } from "../utils/responses/serviceResponses.";

export type ServiceSearchPayload = {
  query: string;
};

export const ServiceService = {
  async create(content: CreateService) {
    try {
      return await prisma.service.create({
        data: {
          name: content.name.trim().normalize("NFC").toLowerCase(),
          price: content.price
        }
      });

    } catch {
      throw {
        statusCode: 400,
        message: ServiceResponses.SERVICE_CREATED_ERROR
      }
    }
  },

  async get(id: string) {
    const service = await prisma.service.findUnique({
      where: {
        id
      }
    });

    if (!service) throw {
      statusCode: 404,
      message: ServiceResponses.SERVICE_NOT_FOUND
    };

    return service;
  },

  async getByName(name: string) {
    const services = await prisma.service.findMany({
      where: {
        name: name.trim().normalize("NFC").toLowerCase()
      }
    });

    if (services.length === 0) throw {
      statusCode: 404,
      message: ServiceResponses.SERVICE_NOT_FOUND
    };

    return services;
  },

  async getAll() {
    return await prisma.service.findMany();
  },

  async edit(id: string, content: EditService) {
    try {
      const currentService = await prisma.service.findUnique({
        where: {
          id
        }
      });

      if (!currentService) throw {
        statusCode: 404,
        message: ServiceResponses.SERVICE_NOT_FOUND
      };

      let serviceEdited: boolean = false;

      if (
        currentService.name !== content.name ||
        !currentService.price.equals(content.price)
      ) {
        await prisma.service.update({
          where: {
            id
          },
          data: {
            name: content.name.trim().normalize("NFC").toLowerCase(),
            price: content.price
          }
        });

        serviceEdited = true;
      };

      return {
        serviceId: currentService.id,
        updatedService: serviceEdited
      };

    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 500,
        message: ServiceResponses.SERVICE_UPDATED_ERROR
      }
    }
  },

  async delete(id: string) {
    try {
      await prisma.service.delete({
        where: {
          id
        }
      });

    } catch {
      throw {
        statusCode: 404,
        message: ServiceResponses.SERVICE_DELETED_ERROR
      }
    }
  },

  async search(payload: ServiceSearchPayload) {
    return await prisma.service.findMany({
      where: {
        name: {
          startsWith: payload.query
        }
      }
    });
  }
}